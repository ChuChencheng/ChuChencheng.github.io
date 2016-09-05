---
title: script标签不带属性与带async、defer的区别
categories: 前端
tags: 前端 JavaScript script
---

`<script>`
当页面解析到script标签时，会停止解析并下载对应的脚本，并马上执行，执行完毕后再继续解析页面


`<script async>`
async 在下载脚本的同时不会停止解析HTML，但是在下载完成后会停止解析并开始执行，执行完毕后继续解析页面


`<script defer>`
defer 下载脚本时跟async一样不会停止解析HTML，下载完毕后会延迟到页面解析完后执行

async跟defer都只对外部脚本有效，IE7及更早的版本对嵌入脚本也支持defer；
另外，HTML5规范中，defer要按照顺序执行，但实际上defer跟async都不一定会按照顺序执行



参考：http://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html