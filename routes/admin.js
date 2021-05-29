const express = require('express');
const router = express.Router();
const { SuccessModel, ErrorModel } = require('../module/resModel');
const { editNoticeInfo } = require('../module/schoolInfo');
const { login,stayCheck,checkHandle,addAddress,addClub } = require('../module/user')
router.post('/login',(req,res)=>{
  login(req).then(result=>{
    res.send(new SuccessModel(result))
  }).catch((err)=>{
    res.send(new ErrorModel(err))
  })
})
router.get('/stayCheckInfo',(req,res)=>{
  stayCheck(req).then(result=>{
    res.send(new SuccessModel(result))
  }).catch(err=>{
    res.send(new ErrorModel(err))
  })
})
router.get('/checkHandle',(req,res)=>{
  checkHandle(req).then(result=>{
    res.send(new SuccessModel(result))
  }).catch(err=>{
    res.send(new ErrorModel(err))
  })
})

// 添加通讯录
router.post('/addAddress',(req,res)=>{
  addAddress(req).then(result=>{
    res.send(new SuccessModel(result))
  }).catch(err=>{
    res.send(new ErrorModel(err))
  })
})
// 添加社团
router.post('/addClub',(req,res)=>{{
  addClub(req).then(result=>{
    res.send(new SuccessModel(result))
  }).catch(err=>{
    res.send(new ErrorModel(err))
  })
}})

// 修改公告信息
router.post('/editNoticeInfo',(req,res)=>{
  editNoticeInfo(req).then(result=>{
    res.send(new SuccessModel(result))
  }).catch(err=>{

  })
})
module.exports = router