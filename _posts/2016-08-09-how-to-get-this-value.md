---
title: JavaScript笔记——this的取值
---

**有关ECMAScript定义如何获取this请移步[ECMAScript中关于如何获取this的定义][]**

**绝大多数情况下，函数的调用方式决定了this的取值**

# 全局上下文

```
console.log(this === window);  //true
```

# 函数上下文

## 直接调用

```
function fn(){
	return this;
}

fn() === window;  //true

//this的值不是由函数调用设定，默认为全局对象
```

*严格模式下增强了安全措施，this关键字禁止指向全局对象*

```
function fn(){
	"use strict";
	return this;
}

fn() === undefined;  //true

function f(){
	"use strict";
	this.a = 1;
}

f();// 报错，this未定义

var fun = new f();

console.log(fun.a);  //1
```

## 对象方法中的this

指向调用该函数的对象，并且是最靠近的引用

```
var o = {prop: 37};

function independent() {
	return this.prop;
}

o.f = independent;

o.b = {
	g: independent,
	prop: 42
};

console.log(o.f());  //logs 37
console.log(o.b.g());  //logs 42
```

## 构造函数中的this

与即将被创建的新对象绑定，可手动设置返回对象

```
function C(){
	this.a = 37;
}

var o = new C();
console.log(o.a);  //logs 37


function C2(){
	this.a = 37;
	return {a:38};
}

o = new C2();
console.log(o.a);  //logs 38
```

## call和apply

this的值被绑定到一个指定的对象上

如果传递的this值不是一个对象，则会使用ToObject操作将其转换为对象

```
function bar() {
	console.log(Object.prototype.toString.call(this));
}

bar.call(7); // [object Number]
//会通过new Number(7)转换为对象

//如果是字符串则会通过new String('foo')转换为对象
```

## bind

Function.prototype.bind
会创建一个具有相同函数体和作用域的函数，但是新函数的this被永久绑定到bind的第一个参数上，无论这个函数如何被调用

```
function f(){
	return this.a;
}

var g = f.bind({a:"azerty"});
console.log(g());  //azerty

var o = {a:37, f:f, g:g};
console.log(o.f(), o.g());  //37, azerty
```

## DOM事件处理函数中的this

事件处理函数中的this指向触发事件的函数

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<button id="btn">button</button>
<script>
    function eventHandler() {
    	//this指向#btn
        console.log(this);  //<button id="btn">button</button>
    }

    var btn = document.querySelector('#btn');
    btn.addEventListener('click', eventHandler, false);
</script>
</body>
</html>
```

## 内联事件处理函数中的this

指向监听器所在DOM元素

```
<!--
<button onclick="console.log(this);">
    Show this
</button>
-->
<button onclick="alert(this);">
  Show this
</button>

<!--window对象，因为没有设置内部函数的this，非严格模式下默认指向全局对象-->
<button onclick="alert((function(){return this})());">
  Show inner this
</button>
```

# 参考

* [this - JavaScript \| MDN][]
* [Javascript 严格模式详解][]





[this - JavaScript | MDN]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this
[Javascript 严格模式详解]: http://www.ruanyifeng.com/blog/2013/01/javascript_strict_mode.html
[ECMAScript中关于如何获取this的定义]: http://blog.csdn.net/azureternite/article/details/52153809