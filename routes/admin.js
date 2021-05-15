const express = require('express');
const router = express.Router();
const { SuccessModel, ErrorModel } = require('../module/resModel');
const { login,stayCheck,checkHandle } = require('../module/user')
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
module.exports = router