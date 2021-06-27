const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const { email163 } = require('./config/config')
// 发送邮件的方法
const transporter = nodemailer.createTransport(smtpTransport({
  service: 'smtp.163.com',
  host: "smtp.163.com",
  port: 587,
  secure: true,
  auth: {
    user: 'clumsy__bird@163.com',//发信人账号
    pass: 'CPIDKPBVEAVBWGVZ'//发信人密码
  },
  // service: 'qq',
  // secure: true,
  // auth: {
  //   user: '2628349880@qq.com',//发信人账号
  //   pass: 'qxgbgrscdwmdebjb'//发信人密码
  // },
}));
sendMail()
async function sendMail() {
  transporter.sendMail({
    from: '"北院校园通" <clumsy__bird@163.com>',//发信人config
    to: '1834638245@qq.com', //adress 收件人
    cc: '',
    subject: '帖子审核通知',//subject 发送的主题
    html: 'Hi  &nbsp;&nbsp;北院校园通管理员,<br>' +
      '<br>有同学发布新帖子了，快去审核通过吧！<br>' +
      '<br>' +
      '<br>' +
      'Best Regards<br>' +
      '<br>'//html 发送的html内容
  }, function (err, result) {
    if (err) {
      console.log("send email errror:" + err);
    } else {
      console.log("send email success!");
    }
  });
}
会议 ID：126 784 522
会议密码：147258