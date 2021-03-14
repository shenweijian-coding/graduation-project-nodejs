const request = require('../tool/request')
const DB = require('../DB/DB')
const { ObjectId } = require('bson')
// 获取新闻列表
async function getNewsList(){
  return new Promise(async(resolve,reject)=>{
    try {
      const newList = await DB.find('schoolInfo', {"_id": ObjectId('604b48c29382b35c705b387c')})
      resolve(newList)
    } catch (error) {
      reject(error)
    }
  })
}
// 获取通讯录
async function getAddressInfo() {
  return new Promise(async (resolve,reject)=>{
    const addressInfo = await DB.find('schoolInfo', {'_id':ObjectId('604c7360d69568cf6db38641')})
    resolve(addressInfo[0].addressList)
  })
}
module.exports = { getNewsList,getAddressInfo }