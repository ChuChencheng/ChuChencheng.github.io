---
title: JavaScript +new Array(017)
categories: JavaScript
tags:
- JavaScript
---

# 问题

某龙的笔试题，问`console.log(+new Array(017));`输出什么

第一反应是考察new Array()跟017

其实考察的是`+`

`+`运算符作为二元运算符时，有两个功能

* 数字相加
* 连接字符串

数字相加没啥好说的，连接字符串时，会先把两个参数都转换成字符串再进行连接。

`+`作为一元运算符时，会将参数转换为数字返回

# 结果

所以`console.log(+new Array(017));`输出的是`NaN`

# 其他

类似的还有`-`运算符，输出一个转换后的负数

附上一些其他的输出

```javascript
console.log(+new Array());
//0
console.log(+new Array(0));
//0
console.log(+new Array(1));
//0
console.log(+new Array(2));  //2以上都是NaN
//NaN

console.log(+[]);
//0
console.log(+[1]);
//1
console.log(+[1, 2]);
//NaN
console.log(+[undefined]);
//0
console.log(+[undefined, undefined]);
//NaN
```

# 参考

* [ECMAScript® 2016 Language Specification][]



[ECMAScript® 2016 Language Specification]: http://www.ecma-international.org/ecma-262/7.0/index.html#sec-unary-plus-operator
