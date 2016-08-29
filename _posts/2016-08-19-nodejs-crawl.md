---
title: Node.js抓取系列
---

前几天四六级成绩出来（然而我没考），用Node.js做了一个模拟表单提交并抓取数据的Web
总结一下用到的知识，简单的网页抓取大概就是这个流程了

# 发送Get或Post请求

表单提交，首先弄到原网页提交的地址，然后引入http或https模块
也可以下载使用request模块。
这边以get为例

```javascript
var http = require('http');

//设置请求参数，包括headers
var options = {
    url: 'www.chsi.com.cn',
    encoding: null,
    host: 'www.chsi.com.cn',
    path: '/cet/query?' + querystring,
    method: 'GET',
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Connection': 'keep-alive',
        'Cookie': 'JSESSIONID=8D79F004CB79FC5352F123F76CF4D853; __utmt=1; __utma=65168252.1576213452.1471513579.1471575867.1471575870.3; __utmb=65168252.5.10.1471575870; __utmc=65168252; __utmz=65168252.1471575870.3.3.utmcsr=baidu|utmccn=(organic)|utmcmd=organic|utmctr=%E5%AD%A6%E4%BF%A1%E7%BD%91',
        'Host': 'www.chsi.com.cn',
        'Referer': 'http://www.chsi.com.cn/cet/',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
    }
};

var req = http.request(options, function(res){
  res.on('data', function(data){
    //处理data事件，当接收到数据时触发
  }).on('end', function(){
    //处理读取完所有数据的事件
  }).on('error', function(err){
    //处理错误时的事件
    console.log(err);
  });
});

//发送请求
req.end();
```

如果是post请求，需要在`req.end()`之前用`req.write(content)`写入请求参数

# Transfer-Encoding:chunked？

有时候服务器的response header会带有一个Transfer-Encoding，如果是chunked，说明服务器是分段传输数据的
这种情况下，会触发多次res的data事件，因此可以先定义一个变量，然后在data事件处理函数中将接收到的数据拼接起来

```javascript
var data = '';

var req = http.request(options, function(res){
  res.on('data', function(chunk){
    //处理data事件，当接收到数据时触发
    data += chunk;
  }).on('end', function(){
    //处理读取完所有数据的事件
  }).on('error', function(err){
    //处理错误时的事件
    console.log(err);
  });
});

//发送请求
req.end();
```

# 使用zlib库解压gzip压缩过的html

# 压缩html字符串（去除换行符）

# 用正则表达式提取有用的信息

# 解析html





[解压gzip]: http://stackoverflow.com/questions/12148948/how-do-i-ungzip-decompress-a-nodejs-requests-module-gzip-response-body