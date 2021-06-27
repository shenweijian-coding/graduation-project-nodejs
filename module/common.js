const { ObjectId } = require('bson')
const { request } = require('../tool/request')
const DB = require('../DB/DB')
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const { wxApp, email163 } = require('../config/config')

// 通过openid获取用户信息
function getUserInfoByOpenId(openId) {
  return new Promise(async (resolve, reject) => {
    const userInfo = await DB.find('userInfo', { openId })
    resolve(userInfo)
  })
}
// 对userInfo表新增数据
function addNewUserInfo(openId, insertName, insertData) {
  return new Promise(async (resolve, reject) => {
    await DB.addto('userInfo', { openId }, { [insertName]: insertData })
    resolve()
  })
}
function delUserInfo(openId,insertName,insertData){
  return new Promise(async (resolve, reject) => {
    await DB.updateMany('userInfo', { openId }, { [insertName]: insertData })
    resolve()
  })
}
// 通过id 和 数据库 名字 查询 对于帖子
function getCurPostInfo(dbName,id){
  return new Promise(async(resolve,reject)=>{
    // console.log(dbName,id);
    const info = await DB.find(dbName,{ _id:ObjectId(id) })
    resolve(info[0])
  })
}
// 发布评论
function issueComment(req) {
  return new Promise(async (resolve, reject) => {
    const { commentInfo, id, dbName } = req.body
    // 先判断评论集合中是否已有该物品下的交易
    const comRes = await DB.find('comment', { id })
    if (comRes.length) { // 如果有 则执行评论追加
      await DB.addto('comment', { id }, { commentList: { ...commentInfo } })
    } else { // 没有则新插入
      await DB.insert('comment', { id, commentList: [{ ...commentInfo }] })
    }
    // 将trade表的评论数+1 异步即可
    addCommentNum(id, dbName)
    // 添加到消息通知中
    // addToMessageInfo()
    // 发布订阅消息
    subscribeMessage({ dbName, id, commentInfo })
    resolve('评论成功')
  })
}

// 消息通知
function addToMessageInfo(){
  return new Promise(async (resolve, reject)=>{

  })
}

// 微信订阅消息发布
function subscribeMessage({ dbName, id, commentInfo }){
  return new Promise(async(resolve, reject)=>{
    const info = await getCurPostInfo(dbName, id)
    // 获取accesstoken
    const access_token = await getAssessToken()
    const res = await request({
      url: `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${access_token}`,
      method: 'POST',
      data:{
        access_token: access_token,
        touser: info.openId,
        template_id: 'sF1GNcIRY1koF-7kGTa5hqIqm92HHIxfoM3zqky8tkA',
        data:{
          thing1:{ // 回复人
            value:commentInfo.name
          },          
          thing2:{ // 回复内容
            value:commentInfo.desc
          },          
          time3:{ // 回复时间
            value: commentInfo.createTime
          },          
          thing5:{ // 回复主题
            value:info.desc
          }
        }
      }
    })
    // console.log(res);
  })
}

// 获取接口凭证
async function getAssessToken(){
  return new Promise(async(resolve,reject)=>{
    const access_tokenInfo = await DB.find('setting',{ _id:ObjectId('60b1d8f94337153ee8da456a') })
    let access_token
    if(access_tokenInfo[0].time !== '' && access_tokenInfo[0].access_token !== ''){
      if(parseFloat(access_tokenInfo[0].time) + 5400 > new Date().getTime()/1000){
        access_token = access_tokenInfo[0].access_token
      }else{
        const wxRes = await request({
          url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxApp.AppID}&secret=${wxApp.AppSecret}`
        })
        access_token = wxRes.access_token
        await DB.update('setting',{ _id:ObjectId('60b1d8f94337153ee8da456a') },{ access_token: access_token, time: new Date().getTime()/1000 })
      }
    }else{
      const wxRes = await request({
        url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxApp.AppID}&secret=${wxApp.AppSecret}`
      })
      access_token = wxRes.access_token
      await DB.update('setting',{ _id:ObjectId('60b1d8f94337153ee8da456a') },{ access_token: access_token, time: new Date().getTime()/1000 })

    }
    resolve(access_token)
  })
}
// 评论数进行++操作
async function addCommentNum(id, dbName) {
  const info = await DB.find(dbName, { "_id": ObjectId(id) })
  if (!info.length) return
  DB.update(dbName, { "_id": ObjectId(id) }, { disNum: info[0].disNum + 1 })
}

// 查询评论
function getCommentList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const id = req.query.id // 获取物品信息
      const commentList = await DB.find('comment', { id })
      if (!commentList.length) resolve('暂无评论')
      resolve(commentList[0])
    } catch (error) {
      reject(error)
    }
  })
}
// 获取推荐信息
function getRecommendInfo(req){
  return new Promise(async(resolve,reject)=>{
    const { pageSize = 0, pageNum = 10 } = req.query
    const openId = req.openid
    const userInfo = await DB.find('userInfo',{ openId })
    const likeList = userInfo[0].likeList
    const tradeInfo = await DB.find('trade',{},pageSize,pageNum)
    tradeInfo.forEach(element => {
      for (let i = 0; i < likeList.trade.length; i++) {
        if(element._id == likeList.trade[i]) {
          element.isLike = true
        }
      }
    });
    const helpInfo = await DB.find('help',{},pageSize,pageNum)
    helpInfo.forEach(element => {
      for (let i = 0; i < likeList.help.length; i++) {
        if(element._id == likeList.help[i]){
          element.isLike = true
        }
      }
    });
    resolve([...tradeInfo,...helpInfo])
  })
}

// 删除发布记录
function delIssueInfo(req){
  return new Promise(async(resolve,reject)=>{
    const openId = req.openid
    const { id,dbName } = req.query
    const res = await DB.find(dbName,{ '_id':ObjectId(id) })
    if(!res.length) return
    if(res[0].openId !== openId) {
      resolve('您无权限删除')
      return
    }
    DB.remove(dbName,{ '_id':ObjectId(id) })
    resolve('删除成功')
  })
}

// 点赞与取消点赞
function isLike(req){
  return new Promise(async(resolve,reject)=>{
    const openId = req.openid
    const { isLike,id,dbName } = req.query
    const res = await DB.find(dbName,{ '_id':ObjectId(id) })
    if(!res.length) return
    if(isLike === 'true') { // 增加
      await DB.update(dbName,{'_id':ObjectId(id)},{ likeNum: parseInt(res[0].likeNum) + 1 })

      addNewUserInfo(openId,`likeList.${dbName}`,id)
    }else { // 减少
      if(res[0].likeNum == 0) return
      await DB.update(dbName,{'_id':ObjectId(id)},{ likeNum: parseInt(res[0].likeNum) - 1 })
      delUserInfo(openId,`likeList.${dbName}`,id)
    }
    // 将喜欢的发表放到个人中心中
    resolve({})
  })
}
function getLikeIssueInfo(req){
  return new Promise(async(resolve,reject)=>{
    const openId = req.openid
    const userInfo = await DB.find('userInfo', { openId })
    if(!userInfo.length) {
      resolve({})
      return
    }
    const likeList = userInfo[0].likeList
    const res = await getCurDataById(likeList)
    resolve(res)
  })
}
// 通过id查找对应数据
function getCurDataById(dataList){
  return new Promise(async(resolve,reject)=>{
    let info = []
    for (const key in dataList) {
      if (Object.hasOwnProperty.call(dataList, key) && dataList[key].length) {
        let querySql = []
        for (let i = 0; i < dataList[key].length; i++) {
          // console.log(dataList[key][i]['_id']);
          querySql.push({ "_id":ObjectId(dataList[key][i]) })
        }
        const res = await DB.find(key,{$or:querySql})
        info = [...info,...res]
      }
    }
    resolve(info)
  })
}

// 发送邮件的方法
const transporter = nodemailer.createTransport(smtpTransport({
  service: email163.service,
  host: email163.host,
  secure: true,
  port: email163.port,
  auth: {
    user: email163.user,//发信人账号
    pass: email163.pass//发信人密码
  },
}));
async function sendMail() {
  const homeInfo = await DB.find('schoolInfo',{_id:ObjectId('606005390b487148f80cc40f')})
  if(!homeInfo[0].isEmail){
    return
  }
  const adminInfo = await DB.find('admin', { _id:ObjectId('609e7f9a7325ad868d79ee1e') })
  const address = adminInfo[0].email
  console.log(address);
  transporter.sendMail({
    from: '"北院校园通" <clumsy__bird@163.com>',//发信人config
    to: address, //adress 收件人
    cc: '',
    subject: '帖子审核通知',//subject 发送的主题
    html: 'Hi  &nbsp;&nbsp;北院校园通管理员,<br>' +
      '<br>有同学发布新帖子了，快去审核通过吧！<br>' +
      '<br>' +
      '<br>' +
      'Best Regards<br>' +
      '<br>'//html 发送的html内容
  }, function (err, result) {
    if (err) {
      console.log("send email errror:" + err);
    } else {
      console.log("send email success!");
    }
  });
}

module.exports = {
  getUserInfoByOpenId,
  addNewUserInfo,
  issueComment,
  getCommentList,
  getRecommendInfo,
  delIssueInfo,
  isLike,
  getLikeIssueInfo,
  sendMail
}