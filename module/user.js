const request = require('../tool/request')
const DB = require('../DB/DB')
const { ObjectId } = require('bson')
// 获取cookie
function getOpenId(req){
  const openid = req.headers.cookie
  if(!openid) return true
  req.openid = openid
}
// 更新用户信息
function updateUserInfo(req) {
  return new Promise(async(resolve,reject)=>{
    try {
      const openid = req.openid
      const { name, college, grade, major, email, wxName,avator,gender } = req.body
      const info = {
        userInfo: { avator, gender },
        schoolInfo: { grade, major, college, name },
        contactWay: { wxName, email }
      }
      await DB.update('userInfo', { openId:openid },{ info:info },{ multi:1 })
      resolve({})
    } catch (error) {
      reject(error)
    }
  })
}
// 查询用户信息
function getUserInfo(req) {
  return new Promise(async (resolve,reject)=>{
    const openId = req.openid
    const userInfo = await DB.find('userInfo', { openId })
    if(!userInfo.length) {
      reject('未找到该用户信息')
    }
    resolve(userInfo[0].info)
  })
}
module.exports = { updateUserInfo,getOpenId, getUserInfo }