const express = require('express');
const router = express.Router();
const request = require('../tool/request')
const { wxApp } = require('../config/config')
const { SuccessModel } = require('../module/resModel');
const DB = require('../DB/DB');

// 小程序登录接口
router.get('/login',async (req,res)=>{
  // 获取到登录后的code
  const { code } = req.query
  // 向微信服务器发送信息获取到 openid 和 session_key
  const wxRes = await request({
    url: `https://api.weixin.qq.com/sns/jscode2session?appid=${wxApp.AppID}&secret=${wxApp.AppSecret}&js_code=${code}&grant_type=authorization_code`
  })
  // 先查询有没有 没有存入
  const userInfo = await DB.find('userInfo', { openId: wxRes.openid })
  const likeList = {
    trade:[],
    love:[],
    lostandfound:[],
    help:[]
  }
  if(!userInfo.length) {
    // 获取openid 作为识别用户的唯一标识符 存入数据库
    await DB.insert('userInfo', { openId: wxRes.openid,likeList })
  }
  // 换取openId 返回小程序  绑定个人信息用
  res.send(new SuccessModel(wxRes))
})
module.exports = router