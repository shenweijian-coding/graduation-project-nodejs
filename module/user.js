const request = require('../tool/request')
const DB = require('../DB/DB')
const { ObjectId } = require('bson')
const { addNewUserInfo } = require('./common')

// 管理员登录
function login(req){
  return new Promise(async(resolve,reject)=>{
    const { uid,pwd } = req.body
    const info = await DB.find('admin', { "uid":uid })
    if(info.length!=1){
      reject('未找到该账号')
    }
    if(info[0].pwd === pwd){
      resolve('登录成功')
    }else{
      reject('密码错误')
    }
  })
}

// 管理员获取列表
function stayCheck(req){
  return new Promise(async(resolve,reject)=>{
    const { type } = req.query
    const info = await DB.find('stayBy',{ type })
    resolve(info)
  })
}

// 管理员审核
function checkHandle(req){
  return new Promise(async(resolve,reject)=>{
    const { id,isPass } = req.query
    const insertInfo = await DB.find('stayBy',{'_id':ObjectId(id)})
    if(parseFloat(isPass) === 1){
      const { type,openId } = insertInfo[0]
      const { insertedId } = await DB.insert(type, { ...insertInfo[0]})
      await addNewUserInfo(openId, type, insertedId.toString())
    }
    DB.remove('stayBy',{'_id':ObjectId(id)})
    resolve('success')
  })
}

// 管理员添加通讯录
function addAddress(req){
  return new Promise(async(resolve,reject)=>{
    const { type, title, tel } = req.body
    const addressInfo = await DB.find('schoolInfo',{ _id:ObjectId('606006210b487148f80cc410') })
    const resArr = addressInfo[0].addressList
    for (let i = 0; i < resArr.length; i++) {
      if(resArr[i].title === type){
        resArr[i].phoneList.push({ name:title, phone:tel })
      }
    }
    await DB.update('schoolInfo', { _id:ObjectId('606006210b487148f80cc410') }, {addressList:resArr})
    resolve({})
  })
}

// 管理员添加社团
function addClub(req){
  return new Promise(async(resolve,reject)=>{
    // console.log(req.body);
    await DB.insert('club', { ...req.body })
    resolve({})
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
module.exports = { updateUserInfo,getOpenId, getUserInfo,getIssueInfo,login,stayCheck,checkHandle,addClub,addAddress }