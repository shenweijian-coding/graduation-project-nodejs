const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const fs = require('fs')
const { getNewsList,getAddressInfo, getClubInfo, getHomeInfo,getNewsInfo } = require('../module/schoolInfo');
const { getResellInfo, postTrade, issueLoseInfo, getLostInfo, issueNeedInfo,getHelpInfo } = require('../module/resell')
const { SuccessModel, ErrorModel } = require('../module/resModel');
const { updateUserInfo, getUserInfo } = require('../module/user');
const { issueComment, getCommentList, getRecommendInfo } = require('../module/common');
const { getLoveInfo, issueLoveInfo } = require('../module/love');
// 获取校园新闻数据
router.get('/getNewsList',(req,res)=>{
  getNewsList().then(result=>{
    res.send(new SuccessModel(result))
  }).catch(err=>{
    console.log(err);
  })
})
router.get('/getNewsInfo',(req,res)=>{
  getNewsInfo(req).then(result=>{
    res.send(new SuccessModel(result))
  }).catch(err=>{
    console.log(err);
  })
})
// 获取小程序首页数据
router.get('/getHomeInfo',(req,res)=>{
  getHomeInfo().then(result=>{
    res.send(new SuccessModel(result))
  }).catch(err=>{
    console.log(err);
  })
})
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
// 获取社团信息接口
router.get('/getClubInfo', (req,res)=>{
  getClubInfo(req).then(result=>{
    res.send(new SuccessModel(result))
  }).catch(err=>{
    console.log(err.message);
    res.send(new ErrorModel(err.message))
  })
})
// 上传图片文件接口
router.post('/upload',(req,res)=>{
  const form = new formidable.IncomingForm();
  form.parse(req, function(error, fields, files){
    const name = `public/${files.file.name}`
    // 读取文件流并写入到public/test.png
    fs.writeFileSync(name, fs.readFileSync(files.file.path));
    res.send(name)
  })
})
// 获取交易信息 二手交易部分
router.get('/getResellInfo', (req,res)=>{
  getResellInfo().then(result=>{
    res.send(new SuccessModel(result))
  }).catch(err=>{
    console.log(err);
  })
})

// 发布商品接口  二手物品交易
router.post('/postTrade',(req,res)=>{
  postTrade(req).then(result=>{
    res.send(new SuccessModel(result))
  }).catch(err=>{
    console.log(err);
  })
})

// 发布评论接口
router.post('/issueComment',(req,res)=>{
  issueComment(req).then(result=>{
    res.send(new SuccessModel(result))
  }).catch(err=>{
    console.log(err)
    res.send(new ErrorModel(err.message))
  })
})

// 查询评论信息
router.get('/getCommentList',(req,res)=>{
  getCommentList(req).then(result=>{
    res.send(new SuccessModel(result))
  }).catch(err=>{
    console.log(err);
  })
})

// 查询失物招领信息
router.get('/getLostInfo',(req,res)=>{
  getLostInfo(req).then(result=>{
    res.send(new SuccessModel(result))
  }).catch(err=>{
    console.log(err)
  })
})

// 发布失物招领
router.post('/issueLoseInfo',(req,res)=>{
  issueLoseInfo(req).then(result=>{
    res.send(new SuccessModel(result))
  }).catch(err=>{
    console.log(err);
  })
})

// 查询表白模块信息
router.get('/getLoveInfo',(req,res)=>{
  getLoveInfo(req).then(result=>{
    res.send(new SuccessModel(result))
  })
})

// 添加表白信息
router.post('/issueLoveInfo',(req,res)=>{
  issueLoveInfo(req).then(result=>{
    res.send(new SuccessModel(result))
  }).catch(err=>{
    console.log(err);
  })
})

// 发布需求
router.post('/issueNeedInfo',(req,res)=>{
  issueNeedInfo(req).then(result=>{
    res.send(new SuccessModel(result))
  })
})

// 查询需求
router.get('/getHelpInfo',(req,res)=>{
  getHelpInfo().then(result=>{
    res.send(new SuccessModel(result))
  })
})

// 最近发布的文章
router.get('/getRecommendInfo',(req,res)=>{
  getRecommendInfo().then(result=>{
    res.send(new SuccessModel(result))
  })
})

// 查询发布的记录
router.get('/getIssueInfo',(req,res)=>{
  getIssueInfo(req).then(result=>{
    res.send(new SuccessModel(result))
  })
})
router.get('/', function (req, res) {
  res.send('用户首页');
});
module.exports = router;