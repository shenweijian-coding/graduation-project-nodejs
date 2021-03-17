const request = require('../tool/request')
const DB = require('../DB/DB')
const { ObjectId } = require('bson')
// 获取新闻列表
async function getNewsList(){
  return new Promise(async(resolve,reject)=>{
    try {
      const newList = await DB.find('schoolInfo', {"_id": ObjectId('604b48c29382b35c705b387c')})
      resolve(newList[0])
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
// 获取社团信息
async function getClubInfo(req) {
  return new Promise(async (resolve,reject)=>{
    const { type } = req.query
    console.log(type);
    const res = await DB.find('club', { type: type })
    resolve(res)
  })
}
// 获取首页校园信息
async function getHomeInfo(){
  return new Promise(async(resolve,reject)=>{
    try {
      const homeInfo = await DB.find('schoolInfo', {'_id':ObjectId('6050a205f1112d4d6607ceb2')})
      resolve(homeInfo[0])
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = { getNewsList,getAddressInfo,getClubInfo,getHomeInfo }