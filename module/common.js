const { ObjectId } = require('bson')
const DB = require('../DB/DB')
const { SuccessModel } = require('./resModel')
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
// 发布评论
function issueComment(req) {
  return new Promise(async (resolve, reject) => {
    const { commentInfo, id, type } = req.body
    let dbName = ''
    switch (type) {
      case 1:
        dbName = 'trade'
        break;
      case 2:
        dbName = 'help'
        break;
      case 3:
        dbName = 'love'
        break;
      default:
        break;
    }
    // 先判断评论集合中是否已有该物品下的交易
    const comRes = await DB.find('comment', { id })
    if (comRes.length) { // 如果有 则执行评论追加
      await DB.addto('comment', { id }, { commentList: { ...commentInfo } })
    } else { // 没有则新插入
      await DB.insert('comment', { id, commentList: [{ ...commentInfo }] })
    }
    // 将trade表的评论数+1 异步即可
    addCommentNum(id, dbName)
    resolve('评论成功')
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
    console.log(id,dbName);
    const res = await DB.find(dbName,{ '_id':ObjectId(id) })
    if(!res.length) return
    console.log(res);
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
          console.log(dataList[key][i]['_id']);
          querySql.push({ "_id":ObjectId(dataList[key][i]) })
        }
        const res = await DB.find(key,{$or:querySql})
        info = [...info,...res]
      }
    }
    resolve(info)
  })
}
module.exports = {
  getUserInfoByOpenId,
  addNewUserInfo,
  issueComment,
  getCommentList,
  getRecommendInfo,
  delIssueInfo,
  isLike,
  getLikeIssueInfo
}