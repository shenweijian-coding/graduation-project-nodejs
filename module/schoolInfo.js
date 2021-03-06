const request = require('../tool/request')
const DB = require('../DB/DB')
const { ObjectId } = require('bson')
// 获取新闻列表
async function getNewsList() {
  return new Promise(async (resolve, reject) => {
    try {
      const newList = await DB.find('schoolInfo', { "_id": ObjectId('604b48c29382b35c705b387c') })
      resolve(newList[0])
    } catch (error) {
      reject(error)
    }
  })
}
// 获取新闻详情
async function getNewsInfo(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const href = req.query.href
      const newsDetail = await DB.find('schoolInfo', { href })
      resolve(newsDetail[0])
    } catch (error) {
      reject(error)
    }
  })
}
// 获取通讯录
async function getAddressInfo() {
  return new Promise(async (resolve, reject) => {
    const addressInfo = await DB.find('schoolInfo', { '_id': ObjectId('606006210b487148f80cc410') })
    resolve(addressInfo[0].addressList)
  })
}
// 获取社团信息
async function getClubInfo(req) {
  return new Promise(async (resolve, reject) => {
    const { type = null, keyword = null } = req.query
    // console.log(type, keyword);
    let res = ''
    if (type === null) { // 搜索
      const r = RegExp(keyword)
      res = await DB.find('club', { title: { $regex: r } })
    } else if (keyword === null) { // 查询
      res = await DB.find('club', { type: type })
    }
    resolve(res)
  })
}
// 获取首页校园信息
async function getHomeInfo() {
  return new Promise(async (resolve, reject) => {
    try {
      const homeInfo = await DB.find('schoolInfo', { '_id': ObjectId('606005390b487148f80cc40f') })
      resolve(homeInfo[0])
    } catch (error) {
      reject(error)
    }
  })
}
// 编辑公告
async function editNoticeInfo(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const { noticeInfo } = req.body
      await DB.update('schoolInfo', { _id: ObjectId('606005390b487148f80cc40f') }, { notice: noticeInfo })
      resolve('success')
    } catch (error) {

    }
  })
}
// 小程序维护
async function pause(req){
  return new Promise(async (resolve,reject)=>{
    try {
      const { isMaintain } = req.body
      await DB.update('schoolInfo', { _id: ObjectId('606005390b487148f80cc40f') }, { isMaintain: isMaintain })
      resolve('success')
    } catch (error) {
      
    }
  })
}

// 小程序发布按钮
async function showIssue(req){
  return new Promise(async (resolve,reject)=>{
    try {
      const { isShowIssue } = req.body
      await DB.update('schoolInfo', { _id: ObjectId('606005390b487148f80cc40f') }, { isShowIssue: isShowIssue })
      resolve('success')
    } catch (error) {
      
    }
  })
}

// 小程序发布按钮
async function postMessage(req){
  return new Promise(async (resolve,reject)=>{
    try {
      const { isEmail } = req.body
      await DB.update('schoolInfo', { _id: ObjectId('606005390b487148f80cc40f') }, { isEmail: isEmail })
      resolve('success')
    } catch (error) {
      
    }
  })
}

// 首页banner图
async function setBanners(req){
  return new Promise(async (resolve,reject)=>{
    try {
      const { banners } = req.body
      await DB.update('schoolInfo', { _id: ObjectId('606005390b487148f80cc40f') }, { banners: banners })
      resolve('success')
    } catch (error) {
      
    }
  })
}
module.exports = { getNewsList, 
  getAddressInfo, 
  editNoticeInfo, 
  getClubInfo, 
  getHomeInfo, 
  getNewsInfo,
  setBanners,
  showIssue,
  pause,
  postMessage
 }