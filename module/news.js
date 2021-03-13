const request = require('../tool/request')
const DB = require('../DB/DB')
const { ObjectId } = require('bson')
async function getNewsList(){
  return new Promise(async(resolve,reject)=>{
    try {
      const newList = await DB.find('news', {"_id": ObjectId('604b48c29382b35c705b387c')})
      resolve(newList)
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = { getNewsList }