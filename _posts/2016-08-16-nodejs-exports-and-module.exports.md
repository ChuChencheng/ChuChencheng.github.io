---
layout: post
title: Node.js exports与module.exports的关系
---

今天搜索module.exports时看到CNode社区上发的Hack Sparrow一篇相关文章的链接
[Node.js Module – exports vs module.exports][]
一篇5年前的远古巨坟…

网上也有相应的翻译，[nodejs中exports与module.exports的区别详细介绍][]

又看了下CNode上的一篇介绍，[exports 和 module.exports 的区别][]

下面做个总结，感谢CNode社区上[@manecocomph][]的解释，十分直白（在上面那篇文章的评论里）


其实exports跟module.exports初始时指向的是同一个空对象{}，因此在exports上添加的属性也会被添加到module.exports上
而在另一个文件中，require的返回值是module.exports，因此当exports跟module.exports不指向同一个对象时，exports中的属性便不会被导出

```javascript
console.log(exports);  //{}
console.log(module.exports);  //{}
console.log(exports === module.exports);  //true
```

------

rocker.js

```javascript
exports.name = 'naive';  //{ name: 'naive' }
module.exports = {};  //{}，与exports不再指向同一个对象
```

app.js

```javascript
var rocker = require('./rocker.js');
console.log(rocker.name);  //undefined
```

------


参考：

[Node.js Module – exports vs module.exports][]
[exports 和 module.exports 的区别][]


[Node.js Module – exports vs module.exports]: http://www.hacksparrow.com/node-js-exports-vs-module-exports.html
[nodejs中exports与module.exports的区别详细介绍]: http://www.jb51.net/article/33269.htm
[exports 和 module.exports 的区别]: http://cnodejs.org/topic/5231a630101e574521e45ef8
[@manecocomph]: http://cnodejs.org/user/manecocomph