const express = require('express');
const router = express.Router();
const { SuccessModel, ErrorModel } = require('../module/resModel');
const { login } = require('../module/user')
router.post('/login',(req,res)=>{
  console.log('login');
  login(req).then(result=>{
    res.send(new SuccessModel(result))
  }).catch((err)=>{
    res.send(new ErrorModel(err))
  })
})
module.exports = router