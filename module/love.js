
const DB = require('../DB/DB');
const { sendMail } = require('./common');
function getLoveInfo(req){
  return new Promise(async(resolve,reject)=>{
    const { pageNum, pageSize } = req.query
    const loveInfo = await DB.find('love',{}, pageSize, pageNum)
    // console.log(loveInfo);
    resolve(loveInfo)
  })
}
function issueLoveInfo(req){
  return new Promise(async(resolve,reject)=>{
    const openId = req.openid
    const reqData = req.body
    reqData.openId = openId
    await DB.insert('stayBy', { ...reqData })
    sendMail()
    // 插入表白信息表
    // const { insertedId } = await DB.insert('love', { ...reqData })
    // 将id绑定到userInfo集合
    // await addNewUserInfo(openId,'love', insertedId.toString())
    resolve('成功')
  })
}

module.exports = {
  getLoveInfo,
  issueLoveInfo
}