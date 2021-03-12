const express = require('express')
const bodyParser = require('body-parser')
const https = require("https");
const app = express()
const port = 3000
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
const httpsOption = {
  key : fs.readFileSync("./2_yuanxiaoshen.com.key"),
  cert: fs.readFileSync("./1_yuanxiaoshen.com_bundle.pem")
}
//添加两个路由到应用上
app.use('/api', require('./routes/api'));


app.get('/', (req, res) => res.send('Hello World!'))
https.createServer(httpsOption, app).listen(port);