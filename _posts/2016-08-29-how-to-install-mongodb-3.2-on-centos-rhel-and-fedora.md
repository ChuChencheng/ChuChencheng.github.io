---
title: \[译\]如何在CentOS/RHEL & Fedora上安装MongoDB 3.2
---

MongoDB（名称取自“huMONGOus“）是一个有着全面灵活的索引支持和丰富的查询的数据库。MongoDB通过GridFS提供强大的媒体存储。点击[这里](http://www.10gen.com/products/mongodb)获取MongoDB的更多信息

MongoDB发布了一个新的稳定版本 3.2，进行了大量的改进。本教程将帮助你在CentOS, RHEL 和 Fedora 系统上安装MongoDB 3.2.X


# 第一步 —— 将MongoDB添加到yum仓库

将下列内容按照你需要的MongoDB版本和系统架构添加到yum仓库的配置文件/etc/yum.repos.d/mongodb.repo中。在本文中我们使用MongoDB 3.2的仓库。

64位系统使用：

```
[MongoDB]
name=MongoDB Repository
baseurl=http://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.2/x86_64/
gpgcheck=0
enabled=1
```

# 第二步 —— 安装MongoDB服务器

使用yum包管理器安装mongodb-org包，这个操作会自动安装所有的依赖。若要安装具体的MongoDB修订版，只要指定包的名称，带上版本号，例如mongodb-org-3.2.0。以下命令会安装最新可用的稳定版。

```bash
# yum install mongodb-org
```

# 第三步 —— 启动MongoDB

mongodb-org-server包提供了MongoDB的初始化脚本，用脚本来启动服务

```bash
# /etc/init.d/mongod restart
```

配置MongoDB随系统自启动

```bash
# chkconfig mongod on
```

# 第四步 —— 检查MongoDB版本

使用以下命令来检查MongoDB的版本

```bash
[root@tecadmin ~]#  mongod --version

db version v3.2.0
git version: 45d947729a0315accb6d4f15a6b06be6d9c19fe7
OpenSSL version: OpenSSL 1.0.1e-fips 11 Feb 2013
allocator: tcmalloc
modules: none
build environment:
    distmod: rhel70
    distarch: x86_64
    target_arch: x86_64
```

连接到MongoDB并执行几个测试的命令来检查是否正常工作

```bash
[root@tecadmin ~]#  mongo

> use mydb;

> db.test.save( { a: 1 } )

> db.test.find()

  { "_id" : ObjectId("54fc2a4c71b56443ced99ba2"), "a" : 1 }
```

恭喜，你已经成功地在你的系统上安装了MongoDB服务器。你还可以在此处进行练习 [MongoDB browser shell](http://try.mongodb.org/)。

# 参考：

http://docs.mongodb.org/manual/installation/

# 原文地址

[How to Install MongoDB 3.2 on CentOS/RHEL & Fedora](http://tecadmin.net/install-mongodb-on-centos-rhel-and-fedora/)
