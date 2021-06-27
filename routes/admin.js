const express = require('express');
const { graspNews } = require('../graspNews');
const router = express.Router();
const { SuccessModel, ErrorModel } = require('../module/resModel');
const { editNoticeInfo, pause, showIssue, setBanners, postMessage } = require('../module/schoolInfo');
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

// 小程序维护
router.post('/pause',(req,res)=>{
  pause(req).then(result=>{
    res.send(new SuccessModel(result))
  })
})

// 是否显示发布按钮
router.post('/showIssue',(req,res)=>{
  showIssue(req).then(result=>{
    res.send(new SuccessModel(result))
  })
})

// banner图
router.post('/setBanners',(req,res)=>{
  setBanners(req).then(result=>{
    res.send(new SuccessModel(result))
  })
})
// 更新新闻
router.get('/updateNews',(req,res)=>{
  graspNews().then(result=>{
    res.send(new SuccessModel('更新成功'))
  })
})

// 邮箱通知
router.post('/postMessage',(req,res)=>{
  postMessage(req).then(result=>{
    res.send(new SuccessModel('开启成功'))
  })
})
module.exports = router