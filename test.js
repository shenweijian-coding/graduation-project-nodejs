const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const { email } = require('./config/config')
// 发送邮件的方法
const transporter = nodemailer.createTransport(smtpTransport({
  service: email.service,
  auth: {
    user: email.user,//发信人账号
    pass: email.pass//发信人密码
  },
}));
sendMail()
async function sendMail() {
  transporter.sendMail({
    from: '"北院校园通" <2628349880@qq.com>',//发信人config
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