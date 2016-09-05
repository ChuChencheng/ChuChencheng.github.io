---
title: Node.js实现CORS跨域资源共享
categories: Node.js 前端
tags: CORS Node.js
---

# 什么是CORS

CORS(Cross-origin resource sharing)，跨域资源共享，是一份浏览器技术的规范，用来避开浏览器的同源策略

简单来说就是解决跨域问题的除了jsonp外的另一种方法

[CORS的wiki][]

# 如何使用CORS

只要服务端在响应时发送一个响应的标头即可

浏览器端还是照常使用ajax，支持get，post

# 在Node.js上启用CORS

参照[StackOverflow上面的一个回答][How to allow CORS in Express/Node.js?]，定义一个中间件来添加响应标头，然后在处理app.get（或post等）之前使用
（这位老兄告诉我们要善用next啊）

```javascript
//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

//...
app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'cool beans' }));
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});
```

只要把app.use(allowCrossDomain);放在处理路由之前就行

注意：Access-Control-Allow-Origin，后面如果是 `*` 就代表所有域名都可以跨域访问到服务器，也可以指定具体的域名，域名一定要小写，不然浏览器这边会报错不允许跨域
然后要指定协议名称，http或https等

# 参考

* [AJAX POST&跨域 解决方案 - CORS][]
* [How to allow CORS in Express/Node.js?][]




[CORS的wiki]: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
[How to allow CORS in Express/Node.js?]: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-node-js
[AJAX POST&跨域 解决方案 - CORS]: http://blog.csdn.net/suhenhappy/article/details/18043241
