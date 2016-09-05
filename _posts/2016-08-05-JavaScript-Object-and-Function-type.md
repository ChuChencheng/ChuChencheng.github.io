---
title: JavaScript笔记——引用类型之Object类型和Function类型
categories: 前端 JavaScript
tags: 前端 JavaScript
---

**《JavaScript高级程序设计》中介绍的几种JavaScript的引用类型，本文只记了Object跟Function类型**

# Object类型

## 创建对象

```
var person = new Object();
var person = {};
//二者效果是一样的，但使用对象字面量表示法定义对象时不会调用Object的构造函数
```

## 访问对象属性

- 点表示法
- 方括号表示法

```
person.name = '';
person['name'] = '';
// 方括号表示法能用变量来访问属性
var propertyName = 'name';
person[propertyName] = '';
//若属性名包含会导致语法错误的字符或关键字、保留字，可以使用方括号表示法表示
person['first name'] = '';

```

# Array类型
# Date类型
# RegExp类型

# Function类型

**(函数是对象，函数名是指针)**

## 定义函数

- 函数声明
- 函数表达式
- Function构造函数

```
//函数声明
function sum(num1, num2){
	return num1 + num2;
}

//函数表达式
var sum = function(num1, num2){
	return num1 + num2;
};

//使用Function构造函数，最后一个参数视为函数体（不推荐）
var sum = new Function('num1', 'num2', 'return num1 + num2');
```

## 没有重载

**因为函数名是一个指针，所以JavaScript的函数没有重载，后面定义的函数会覆盖前面的定义**

```
function add(n){
	return n + 100;
}

function add(n){
	return n + 200;
}

add(100);  //300

var add = function(n){
	return n + 100;
};

var add = function(n){
	return n + 200;
};

add(100);  //300
```

## 函数声明与函数表达式（解析顺序）

函数声明会先被解析，而函数表达式要等到执行至定义的那行代码才会被解析

```
//正常执行
alert(sum(10, 10));
function sum(n1, n2){
	return n1 + n2;
}

//报错
alert(sum(10, 10));
var sum = function (n1, n2){
	return n1 + n2;
};
```
## 作为值传递

```
function callFunction(f, args){
	return f(args);
}

function add(num){
	return num + 10;
}

callFunction(add, 10);  //20

//在一个函数中返回另一个函数
function callFunction(){
	return function(){

	};
}
```

## 函数内部属性

函数内部有两个特殊对象：arguments和this

### arguments

arguments.callee属性指向拥有arguments对象的函数，可用于递归调用，消除函数执行与函数名的耦合

```
//阶乘
function factorial(num){
	if(num <= 1){
		return 1;
	} else {
		return num * arguments.callee(num - 1);  //效果相当于return num * factorial(num - 1);
	}
}

var calFactorial = factorial;

factorial = function(){
	return 0;
};

calFactorial(5);  //120
factorial(5);  //0
```

### this

this引用的是函数执行的环境对象（当在全局作用域中调用函数，this对象引用的是window）

```
window.color = 'red';
var o = {color: 'blue'};

function sayColor(){
	alert(this.color);
}

sayColor();  //'red'

o.sayColor = sayColor;
o.sayColor();  //'blue'
```

### caller属性

函数对象的属性，保存着调用当前函数的函数的引用，如果是在全局作用域中调用，则值为null

```
function outer(){
	inner();
}

function inner(){
	alert(inner.caller);  //或alert(arguments.callee.caller);
}

outer();
/*
弹窗显示
function outer(){
	inner();
}
*/
```

## 函数属性和方法

length, prototype, call(), apply(), bind()

### length

length表示函数希望接收命名参数的个数

```
function fn1(){}
function fn2(a){}
function fn3(a, b){}

alert(fn1.length);  //0
alert(fn2.length);  //1
alert(fn3.length);  //2
```
### prototype

prototype是保存引用类型所有实例方法的地方
prototype不可枚举，for-in无法遍历到

### call()和apply()

用途：在特定作用域中调用函数（可扩充函数的作用域）
相当于改变函数体内this所指的对象
接收的第一个参数相同，要代替原this的对象
后面的参数是要执行函数的形参，call()逐个接收，apply()可以将参数作为数组传入

```
window.num = 0;
var o = {num: 10};

function add(num1, num2){
	alert(num1 + num2 + this.num);
}

add.call(this, 10, 10);  //20
add.call(window, 10, 10);  //20
add.call(o, 10, 10);  //30

add.apply(this, [10, 10]);  //20
add.apply(window, [10, 10]);  //20
add.apply(o, [10, 10]);  //30
```

### bind()

bind()方法会创建一个函数实例，实例的this被绑定为传入bind()中的参数（类似于call和apply第一个参数的作用）

```
window.color = 'red';
var o = {color: 'blue'};

function sayColor(){
	alert(this.color);
}

var objSayColor = sayColor.bind(o);
objSayColor();  //'blue'
```
# 基本包装类型

# 单体内置对象




# 参考

> 《JavaScript高级程序设计》（第3版）






