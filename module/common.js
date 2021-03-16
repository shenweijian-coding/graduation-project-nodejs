const { ObjectId } = require('bson')
const DB = require('../DB/DB')
// 通过openid获取用户信息
function getUserInfoByOpenId(openId){
  return new Promise(async(resolve,reject)=>{
    const userInfo = await DB.find('userInfo', { openId })
    resolve(userInfo)
  })
}
// 对userInfo表新增数据
function addNewUserInfo(openId,insertName, insertData) {
  return new Promise(async (resolve,reject)=>{
    await DB.addto('userInfo',{ openId }, {[insertName]: insertData })
    resolve()
  })
}
// 发布评论
function issueComment(req){
  return new Promise(async (resolve,reject)=>{
    const commentInfo = req.body
    const tradeId = commentInfo.tradeId // 评论的作品id
    const comment = commentInfo.commentInfo // 评论人的头像、昵称、性别、描述 {}
    // 先判断评论集合中是否已有该物品下的交易
    const comRes = await DB.find('comment',{ tradeId })
    if(comRes.length){ // 如果有 则执行评论追加
      await DB.addto('comment', { tradeId }, { commentList:{ ...comment } })
    }else{ // 没有则新插入
      await DB.insert('comment', { tradeId, commentList:[{...comment}] })
    }
    // 将trade表的评论数+1 异步即可
    addCommentNum(tradeId)
    resolve('评论成功')
  })
}
// 评论数进行++操作
async function addCommentNum(tradeId) {
  const tradeInfo = await DB.find('trade', { "_id":ObjectId(tradeId) })
  DB.update('trade', { "_id":ObjectId(tradeId) }, { disNum:tradeInfo[0].disNum + 1 })
}

// 查询评论
function getCommentList(req){{
  return new Promise(async(resolve,reject)=>{
    try {
      const tradeId = req.query.tradeId // 获取物品信息
      const commentList = await DB.find('comment',{ tradeId })
      if(!commentList.length) resolve('暂无评论')
      resolve(commentList[0])
    } catch (error) {
      reject(error)
    }
  })
}}
module.exports = {
  getUserInfoByOpenId,
  addNewUserInfo,
  issueComment,
  getCommentList
}