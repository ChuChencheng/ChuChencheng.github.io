---
title: Array.prototype.filter()的实现
categories: JavaScript
tags: JavaScript filter
---

# 来源

今年某前端笔试的一道题，大概就是实现一遍filter，包括一个可以改变上下文的要求，其实就是改变this啦，跟原生的filter一样的功能跟参数。

# 解析

filter的功能就是过滤，传入一个函数作为条件，返回true则将元素加入最终返回的数组中。

# 实现

```javascript
Array.prototype.filter = function(cb, context){
  context = context || this;  //确定上下文，默认为this
  var len = this.length;  //数组的长度
  var r = [];  //最终将返回的结果数组
  for(var i = 0; i < len; i++){
    if(cb.call(context, this[i], i, this)){  //filter回调函数的三个参数：元素值，元素索引，原数组
      r.push(this[i]);
    }
  }
  return r;
};
```

# 要点

个人觉得考察的是call的使用
