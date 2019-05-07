---
title: var x=y=1;
categories: JavaScript
tags:
- JavaScript
- var
---

# 来源

今年某度校招笔试题

# 题目

```javascript
(function(){
  var x=y=1;
})();
console.log(x);
console.log(y);
```

答案是：
ReferenceError跟1

因为x是用var声明的，所以在函数外无法访问，而y不是。

一个小坑，记录一下。