---
title: JavaScript数组去重的几种方法
categories: JavaScript
tags: JavaScript 数组去重
---

这个老问题，网上普遍都有了，为什么要再写一遍呢，主要是为了记个笔记。。。

# 遍历时搜索结果数组

思路很明确，如下

* 新建一个数组存放结果
* 循环遍历原数组，对于每一个元素，在结果数组中搜索是否存在
* 若不存在则存入结果数组中，返回第二步，直到循环结束

代码就不上了，网上一大把。

这是最直接的方法，但由于嵌套了循环，效率不高。

# 先排序后比较

* 先将原数组进行排序
* 新建一个结果数组
* 遍历排序后的数组，比较第i个元素与结果数组的最后一个元素是否相等
* 如果不相等则存入结果数组

同不上代码。

速度是快了些，但返回的是一个排序后的数组，并且有更快的方法。

# 使用对象记录已有元素

这个方法使用hashtable结构，避免了循环嵌套，而且返回的数组顺序没改变，效率也高。

主要思路是将原数组的元素作为对象的属性名来记录是否出现过：

* 新建一个对象与结果数组
* 遍历原数组，对于第i个元素，访问对象中属性名为i的属性
* 如果属性不存在，则标记此属性为true，并将此元素存入结果数组中，返回第二步直到循环结束

但是这样做也有个问题，对象的属性名在访问时会被转换为字符串，因此不同类型的值也可能被去重，
比如数字0跟字符'0'

解决办法：将hashtable中的标记 true ，改为保存出现过的类型的数组，在判断元素是否出现时，多判断一步保存的类型数组中是否出现过此类型即可

```javascript
Array.prototype.unique = function()  
{  
    var n = {}, r = [], len = this.length, val, type;  
    for (var i = 0; i < this.length; i++) {  
        val = this[i]; //数组元素
        type = typeof val;  //数组元素的类型
        if (!n[val]) {  //如果没有记录
            n[val] = [type];  //保存类型
            r.push(val);  //保存元素到结果数组
        } else if (n[val].indexOf(type) < 0) { //如果有记录，判断其类型是否在记录数组中，如果没有 
            n[val].push(type);  //将此类型添加到记录数组中
            r.push(val);  //保存元素到结果数组
        }  
    }  
    return r;  
}
```

此方法效率高，并且返回的数组元素顺序不变。

# ES6

ES6的许多新特性让人眼前一亮，最近拜读[阮一峰][]老师的[ECMAScript 6入门][]，又皮卡了一种新的数组去重方法

就是利用扩展运算符(...)跟Set数据结构的不重复特性来达到给数组去重的目的。

```javascript
Array.prototype.unique = function(){
  return [...new Set(this)];
};
```

...就一行代码，简洁。

# 参考

* [js数组去重的4个方法][] 以及底下的评论
* [高效率去掉js数组中重复项 - 柔城 - 博客园][]
* [Set和Map数据结构 - ECMAScript 6入门][]



[阮一峰]: http://www.ruanyifeng.com/home.html
[ECMAScript 6入门]: http://es6.ruanyifeng.com/
[Set和Map数据结构 - ECMAScript 6入门]: http://es6.ruanyifeng.com/#docs/set-map
[js数组去重的4个方法]: http://blog.csdn.net/chengxuyuan20100425/article/details/8497277
[高效率去掉js数组中重复项 - 柔城 - 博客园]: http://www.cnblogs.com/sosoft/archive/2013/12/08/3463830.html
