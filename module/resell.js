const DB = require('../DB/DB')
const { getUserInfoByOpenId, addNewUserInfo } = require('../module/common')
// 获取物品发布信息
function getResellInfo() {
  return new Promise(async(resolve,reject)=>{
    try {
      const resellInfo = await DB.find('trade', {})
      resolve(resellInfo)
    } catch (error) {
      reject(error)
    }
  })
}
// 新增物品发布信息
function postTrade(req) {
  return new Promise(async(resolve,reject)=>{
    try {
      const tradeInfo = req.body
      const openId = req.openid
      // 查询该用户信息
      const userList = await getUserInfoByOpenId(openId)
      if(!userList) resolve('未找到用户信息')
      const userInfo = userList[0].info.userInfo
      userInfo.name = userList[0].info.schoolInfo.name
      // 插入数据并 获取插入的id
      const { insertedId } = await DB.insert('trade', { ...tradeInfo, userInfo })
      // 将id绑定到userInfo集合
      await addNewUserInfo(openId,'tradeList', insertedId.toString())
      resolve('发布成功')
    } catch (error) {
      reject(error)
    }
  })
}
function getLostInfo(){
  return new Promise((resolve,reject)=>{
    try {
      
    } catch (error) {
      
    }
  })
}

// 发布失物招领信息
function issueLoseInfo(req){
  return new Promise(async(resolve,reject)=>{
    const lostInfo = req.body
    const openId = req.openid // 获取发布人openid
    // 查询该用户信息
    const userList = await getUserInfoByOpenId(openId)
    if(!userList) resolve('未找到用户信息')
    const userInfo = userList[0].info.userInfo
    userInfo.name = userList[0].info.schoolInfo.name
     // 插入数据并 获取插入的id
    const { insertedId } = await DB.insert('lostandfound', {...lostInfo, userInfo})
    // 将id绑定到userInfo集合
    await addNewUserInfo(openId,'lostandfound', insertedId.toString())
    console.log(lostInfo);
    resolve({})
  })
}
module.exports = { getResellInfo, postTrade, issueLoseInfo,getLostInfo }