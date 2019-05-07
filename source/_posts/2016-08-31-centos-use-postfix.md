---
title: CentOS利用postfix搭建邮件服务器
categories: Linux
tags:
- CentOS
- 邮件服务器
- postfix
---

之前我用nodemailer通过163邮箱来发送邮件，不过没过几天就一直ETIMEDOUT，不知道什么原因，想着还是自己搭一个来发邮件可能靠谱点（flag？）

# 安装postfix

CentOS 7 自带了postfix服务，在/etc/postfix 目录下

没有安装的可以用yum安装

# 为域名添加DNS解析

需要添加三条记录，A记录、MX记录、TXT记录

# 配置postfix

我接触postfix的时候貌似已经被人玩烂了，网上一搜几年前的文章一大把。

有关域名解析、postfix配置跟使用telnet测试发送邮件，可以参照这篇文章，亲测。

[阿里云CentOS Linux服务器上用postfix搭建邮件服务器][]

# Nodemailer连接本机邮件服务器

配置好postfix后，就可以用自己的服务器发送邮件了。

smtp没有通过ssl加密时的端口是25

所以之前定义的transport

```javascript
var transport = nodemailer.createTransport('smtps://username%40163.com:password@smtp.163.com');
```

修改为

```javascript
var transport = nodemailer.createTransport('smtp://@127.0.0.1:25');
```

即可。

相应的，mailOptions里面的from改成xxx@domain.tld（你自己的域名，其实改成其他任意域名都可以成功发送）


![test mail](http://img.blog.csdn.net/20160831012617040)

![other domain](http://img.blog.csdn.net/20160831012638899)

一般会在辣鸡邮件里面找到你发的邮件

# 后续

可以为自己的邮件服务器添加smtp认证跟ssl加密。

网上搜索sasl之类的。

# 参考

* [阿里云CentOS Linux服务器上用postfix搭建邮件服务器][]




[阿里云CentOS Linux服务器上用postfix搭建邮件服务器]: http://www.cnblogs.com/dudu/archive/2012/12/12/linux-postfix-mailserver.html
