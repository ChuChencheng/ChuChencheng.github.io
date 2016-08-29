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
var req = http.request(options, function(res){
  var data = '';
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

现在很多网站在进行数据传输时都会先用gzip或deflate压缩以减小传输数据的体积，这样，我们请求到的数据就是压缩过的数据，无法正常解析，因此需要先解压

Node.js带有一个zlib库可以用来解压gzip格式的数据

我们可以利用Node.js的管道流机制，将接收到的数据先通过pipe()交给zlib处理，然后再进行我们自己的处理

```javascript
var zlib = require('zlib');

var req = http.request(options, function(res){
  var gunzip = zlib.createGunzip();
  res.pipe(gunzip);  //通过pipe()将数据交给gunzip
  var data = '';
  //事件处理，res.on改为gunzip.on
  gunzip.on('data', function(chunk){
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

# 压缩html字符串（去除换行符）

接收到的data如果不是json格式而是html，就需要进一步处理
但是在html中有各种换行符，不方便进行正则匹配，因此先把换行符去掉

```javascript
htmlstring = htmlstring.replace(/[\r\n]/g, '');
```

# 用正则表达式提取有用的信息

去除了烦人的换行符后，就可以愉快地用正则来获取我们需要的信息啦

什么？你不会用正则？
学啊，相信你肯定搜到过这个 [正则表达式30分钟入门教程][] ，需要的时候看一看。

大致的匹配流程是这样的：

```javascript
var reg = new RegExp('');  //参数为正则的pattern

var arr = [];

arr = htmlstring.match(reg);  //显然match()方法返回的是匹配结果的数组，如果没有结果则返回null
```

这里贴个MDN上的文档，提高提高姿势水平
* [RegExp - JavaScript \| MDN][]
* [String.prototype.match() - JavaScript \| MDN][]

# 解析html（可选）

如果你不想用正则对html数据进行处理，没关系，还可以选择对html数据构造DOM树，然后通过各种选择器来获取你需要的数据
像是node-jquery、node-htmlparser之类的，具体的做法问Google吧，这边贴上一篇文章供参考 [NodeJS 中寻找可用的 HTMLParser][]
我也没用过，就不多说了。

# 参考

* [How do I ungzip (decompress) a NodeJS request's module gzip response body?][]
* [正则表达式30分钟入门教程][]
* [RegExp - JavaScript \| MDN][]
* [String.prototype.match() - JavaScript \| MDN][]




[How do I ungzip (decompress) a NodeJS request's module gzip response body?]: http://stackoverflow.com/questions/12148948/how-do-i-ungzip-decompress-a-nodejs-requests-module-gzip-response-body
[正则表达式30分钟入门教程]: http://www.jb51.net/tools/zhengze.html
[RegExp - JavaScript | MDN]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp
[String.prototype.match() - JavaScript | MDN]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match
[NodeJS 中寻找可用的 HTMLParser]: https://cnodejs.org/topic/4fa0d3a1cc088b063a2e04a2
