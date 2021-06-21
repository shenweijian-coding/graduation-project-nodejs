// 数据库
const app = {
  dbUrl: 'mongodb://localhost:27017',
  dbName:'dbBeiYuan'
}
const redis = {

}
const wxApp = {
  AppID:'wx3108a2c687df76f6',
  AppSecret: '323668863a8578f9913060e735186a8c'
}

// 邮箱
const email = {
  port:587,
  host:"qq",
  service:"qq",
  user: '2628349880@qq.com',//发信邮箱账号
  pass: 'qxgbgrscdwmdebjb'//发信邮箱密码，这里的密码用的安全管家生成的动态密码，不是普通的qq登录密码等（邮箱--设置--账户--POP3服务--开启POP3、SMTP服务生成的密码）
}
module.exports = {app, wxApp, email}