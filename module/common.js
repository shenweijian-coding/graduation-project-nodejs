const { ObjectId } = require('bson')
const DB = require('../DB/DB')
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
function getRecommendInfo(){
  return new Promise(async(resolve,reject)=>{
    const tradeInfo = await DB.find('trade',{})
    const helpInfo = await DB.find('help',{})
    resolve([...tradeInfo,...helpInfo])
  })
}
module.exports = {
  getUserInfoByOpenId,
  addNewUserInfo,
  issueComment,
  getCommentList,
  getRecommendInfo
}