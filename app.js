const express = require('express')
const bodyParser = require('body-parser')
const https = require("https");
const http = require('http')
const fs = require('fs');
const { getOpenId } = require('./module/user');
const { ErrorModel } = require('./module/resModel');
const app = express()
const port = 3001
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// 加入静态资源
app.use('/public', express.static('public'));
// https 证书配置
const httpsOption = {
  key : fs.readFileSync("./config/2_yuanxiaoshen.com.key"),
  cert: fs.readFileSync("./config/1_yuanxiaoshen.com_bundle.pem")
}
app.use('/wx', require('./routes/wx'))

// 获取openId
app.use((req,res,next)=>{
  getOpenId(req) ? res.send(new ErrorModel('非法访问')) : next()
})

//添加路由到应用上
app.use('/api', require('./routes/api'));

app.get('/', (req, res) => res.send('Hello World!'))

// https.createServer(httpsOption,app).listen(port,()=>{console.log('success')});
http.createServer(app).listen(port,()=>{console.log('success')});