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

// 查询丢失物品信息
function getLostInfo(req){
  return new Promise(async(resolve,reject)=>{
    try {
      const { role } = req.query
      const lostInfo = await DB.find('lostandfound', { role })
      resolve(lostInfo)
    } catch (error) {
      reject(error)
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
    resolve('发布成功')
  })
}

// 发布需求
function issueNeedInfo(req){
  return new Promise(async(resolve,reject)=>{
    const reqData = req.body
    const openId = req.openid
    // 查询该用户信息
    const userList = await getUserInfoByOpenId(openId)
    if(!userList) resolve('未找到用户信息')
    const userInfo = userList[0].info.userInfo
    userInfo.name = userList[0].info.schoolInfo.name
    const { insertedId } = await DB.insert('help',{...reqData, userInfo})
    // 将id绑定到userInfo集合
    await addNewUserInfo(openId,'helpList', insertedId.toString())
    resolve('发布成功')
  })
}
// 查询需求
function getHelpInfo(){
  return new Promise(async(resolve,reject)=>{
    const helpInfo = await DB.find('help',{})
    resolve(helpInfo)
  })
}
module.exports = { getResellInfo, postTrade, issueLoseInfo,getLostInfo,issueNeedInfo, getHelpInfo }