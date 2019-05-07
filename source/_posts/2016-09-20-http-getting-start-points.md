---
title: HTTP协议入门要点
categories: 协议
tags:
- HTTP
- 协议
- 网络
---

**应用层协议、基于tcp**

# HTTP/0.9

## 命令

`GET`

## 特点

* 服务器只能回应HTML字符串
* 服务器发送完毕后就关闭tcp连接

# HTTP/1.0

## 命令

`GET` `POST` `HEAD`

## 特点

* 每次通信都必须包括头信息（HTTP header）
* 状态码（status code）、多字符集支持、多部分发送（multi-part type）、权限（authorization）、缓存（cache）、内容编码（content encoding）等
* Content-Type
* Content-Encoding
* 每个TCP连接只能发送一个请求（用Connection: keep-alive解决）

# HTTP/1.1

## 命令

`GET` `POST` `PUT` `PATCH` `HEAD` `OPTIONS` `DELETE`

## 特点

* 持久连接，tcp连接默认不关闭，可被多个请求复用
* 管道机制，在同一个tcp连接中，客户端可以同时发送多个请求（但服务器还是按顺序回应请求）
* Content-Length
* 分块传输，Transfer-Encoding: chunked，用来传输动态操作的数据，可不指定Content-Length
* header里新增Host字段指定服务器的域名
* 队头堵塞，同一个tcp连接里，数据通信是按次序进行的，服务器只有处理完一个回应才会进行下一个回应

# SPDY

## 特点

* Google大佬自行研发的协议
* 主要解决HTTP/1.1效率不高的问题
* 作为HTTP/2的基础

# HTTP/2

## 特点

* 二进制协议，头信息和数据体都是二进制，统称为 帧
* 多工，客户端和服务器都可以同时发送多个请求或回应，且不用按照顺序
* 数据流，同一个连接里连续的数据包可能属于不同的回应，因此需要给数据流（每个请求或回应的所有数据包）编号，客户端发出的数据流ID一律为奇数，服务器发出的ID为偶数
* 头信息压缩，使用gzip或compress压缩，客户端和服务器共同维护一张表，生成索引号，只发送索引号
* 服务器推送，服务器可主动向客户端发送资源，比如主动发送js、css等静态资源，不必等服务端解析HTML后发起请求

# 参考

* [HTTP 协议入门 - 阮一峰的网络日志][]



[HTTP 协议入门 - 阮一峰的网络日志]: http://www.ruanyifeng.com/blog/2016/08/http.html
