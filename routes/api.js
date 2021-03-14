const express = require('express');
const router = express.Router();
const request = require('../tool/request')
const { getNewsList,getAddressInfo } = require('../module/schoolInfo');
const { SuccessModel, ErrorModel } = require('../module/resModel');
const { updateUserInfo, getUserInfo } = require('../module/user');

// 修改信息数据接口
router.post('/addUserInfo',(req,res)=>{
  updateUserInfo(req)
  .then(()=>{ res.send(new SuccessModel('提交成功')) })
  .catch((err)=>{
    res.send(new ErrorModel('提交失败'))
    console.log(err.message)
  })
})
// 查询用户信息接口
router.get('/getUserInfo', (req,res)=>{
  getUserInfo(req).then(result=>{
    res.send(new SuccessModel(result))
  }).catch(err=>{
    res.send(new ErrorModel(err))
    console.log(err)
  })
})
// 获取通讯录信息
router.get('/getAddressInfo',(req,res)=>{
  getAddressInfo().then(result=>{
    res.send(new SuccessModel(result))
  }).catch(err=>console.log(err))
})
router.get('/', function (req, res) {
  res.send('用户首页');
});
module.exports = router;