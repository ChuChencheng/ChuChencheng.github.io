---
title: Node.js用ES6原生Promise对异步函数进行封装
categories: Node.js JavaScript
tags: Node.js 异步 Promise
---

# Promise的概念

> Promise 对象用于异步(asynchronous)计算.。一个Promise对象代表着一个还未完成，但预期将来会完成的操作。

Promise的几种状态：

* pending：初始状态，即等待操作的执行
* fulfilled：成功的操作
* rejected：失败的操作

pending的状态既可以转为fulfilled，也可以转为rejected，当状态发生改变时，promise.then(onFulfilled, onRejected)方法将被调用

# Promise的基本用法

1.首先创建一个Promise的实例

```javascript
var promise = new Promise(function(resolve, reject){
    //do something
    if(success){
        resolve(value);
    } else {
        reject(value);
    }
});
```

构造函数的参数Function中带有两个函数对象resolve和reject，二者都是返回一个Promise对象

* resolve用在处理执行成功的场景，Promise从pending转为fulfilled状态时调用
* reject用在处理执行失败的场景，Promise从pending转为rejected状态时调用

2.调用then()方法

```javascript
promise.then(function(value){
    //成功时调用
}, function(value){
    //失败时调用
});
```

# 用Promise来封装异步函数

Node.js中的IO操作都是异步的，因此在写异步程序的过程中容易掉进[回调大坑][]

知道了Promise的基本调用过程，我们就可以用来封装异步的函数了

1.定义函数

```javascript
function sendRequest(){
    return new Promise(function(resolve, reject){
        var req = http.request(options, function(res){
            var data = '';
            res.on('data', function(chunk){
                data += chunk;
            });

            res.on('end', function(){
                //成功后调用
                resolve(data);
            });
        });

        req.on('error', function(err){
            //失败后调用
            reject(err);
        });

        req.end();
    });
}
```

2.调用函数

```javascript
sendRequest().then(function(data){
    console.log(data);
}).catch(function(err){
    console.log(err);
});
```

# 参考

* [Promise - JavaScript \| MDN][]
* [使用 Promise 封装 FileReader][]




[回调大坑]: http://callbackhell.com/
[Promise - JavaScript | MDN]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise
[使用 Promise 封装 FileReader]: https://segmentfault.com/a/1190000004451095