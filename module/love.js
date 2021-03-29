
const DB = require('../DB/DB');
const { addNewUserInfo } = require('./common');
function getLoveInfo(){
  return new Promise(async(resolve,reject)=>{
    const loveInfo = await DB.find('love',{})
    console.log(loveInfo);
    resolve(loveInfo)
  })
}
function issueLoveInfo(req){
  return new Promise(async(resolve,reject)=>{
    const openId = req.openid
    const reqData = req.body
    reqData.openId = openId
    // 插入表白信息表
    const { insertedId } = await DB.insert('love', { ...reqData })
    // 将id绑定到userInfo集合
    await addNewUserInfo(openId,'love', insertedId.toString())
    resolve('成功')
  })
}

module.exports = {
  getLoveInfo,
  issueLoveInfo
}