const request = require('../tool/request')
const DB = require('../DB/DB')
const { ObjectId } = require('bson')

// 管理员登录
function login(req){
  return new Promise(async(resolve,reject)=>{
    const { uid,pwd } = req.body
    console.log(uid,pwd);
    const info = await DB.find('admin', { "uid":uid })
    if(info.length!=1){
      reject('未找到该账号')
    }
    console.log(info);
    if(info[0].pwd === pwd){
      resolve('登录成功')
    }else{
      reject('密码错误')
    }
  })
}
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
      const { name, college, grade, major, email, wxName,avatarUrl,gender } = req.body
      const info = {
        userInfo: { avatarUrl, gender },
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

// 查询用户发布的记录
function getIssueInfo(req){
  return new Promise(async(resolve,reject)=>{
    const openId = req.openid
    const { type } = req.query
    const res = await DB.find( type,{ openId })
    resolve(res)
  })
}
module.exports = { updateUserInfo,getOpenId, getUserInfo,getIssueInfo,login }