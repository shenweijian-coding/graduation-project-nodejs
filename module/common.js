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
module.exports = {
  getUserInfoByOpenId,
  addNewUserInfo
}