---
title: 用Node.js发送邮件
---

**本文讲的是用Node.js通过一个开启smtp的已有的邮箱账号发送邮件，而不是如何创建一个邮件服务器**

# 开启smtp服务

首先要去要使用的邮箱中设置开启smtp，才能正常发送邮件

这边以163邮箱为例

![163mail set smtp](http://img.blog.csdn.net/20160829152743891)

# 安装Nodemailer模块

```bash
npm install nodemailer --save-dev
```

# 设置Nodemailer

```javascript
var nodemailer = require('nodemailer');

//username替换为邮箱名，%40后面是邮件服务器的地址，比如163.com，password替换为邮箱密码（或独立密码，如果有设置的话），@后面填SMTP服务器地址，如163的smtp地址为smtp.163.com
var transport = nodemailer.createTransport('smtps://username%40163.com:password@smtp.163.com');
var mailOptions = {
  from: 'example@163.com',  //发件人
  to: 'abc@163.com, def@163.com',  //收件人，可以设置多个
  subject: '',  //邮件主题
  text: '',  //邮件文本
  html: ''  //html格式文本
};
```

# 发送邮件

```javascript
transport.sendMail(mailOptions, function(err, info){
  if(err){
    return console.log(err);
  }
  console.log('Message sent: ' + info.response);
});
```

成功运行后，去查看一下发件邮箱的已发送，里面会有发送的记录

# 参考

* [Nodemailer &#8211; Send e-mails with Node.JS][]


[Nodemailer &#8211; Send e-mails with Node.JS]: http://nodemailer.com/
