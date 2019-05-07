---
title: JavaScript的几种继承方式
categories:
- [前端]
- [JavaScript]
tags:
- 前端
- JavaScript
- 继承
---

看《JavaScript高级程序设计》做的一些笔记

ECMAScript只支持实现继承，不支持接口继承（因为函数没有签名）


原型链（实现继承的主要方法）：

```javascript
function SuperType(){
  this.property = true;
}


SuperType.prototype.getSuperValue = function(){
  return this.property;
};


function SubType(){
  this.subproperty = false;
}


//继承SuperType
SubType.prototype = new SuperType();


SubType.prototype.getSubValue = function(){
  return this.subproperty;
};


var instance = new SubType();
```


![inheritance_1](http://img.blog.csdn.net/20160715123200377?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)


通过原型链实现继承时不能使用对象字面量创建原型方法，否则会重写原型链
例如：

```javascript
SubType.prototype = new SuperType();

//定义SubType的原型方法
SubType.prototype = {  //这样定义会使上面那行代码无效

};
```


所有函数的默认原型都是Object的实例，因此SuperType.prototype中的[[Prototype]]会指向Object.Prototype



问题：
原型变成另一个类型的实例，原来的实例属性就变成原型属性了，因此包含引用类型值的属性会被所有SubType实例共享（例如数组）



借用构造函数：

在子类型的构造函数中使用call()或apply()调用超类型的构造函数

```javascript
function SuperType(){
  this.colors = [];
}


function SubType(){
  //继承SuperType
  SuperType.call(this);
}
```


可以在子类型构造函数中向超类型构造函数传递参数


问题：
方法都在构造函数中定义，函数无法复用（类似构造函数模式）；在超类型原型中定义的方法对子类型不可见



组合继承(常用继承模式)：

将原型链和借用构造函数组合到一块（类似组合使用构造函数模式和原型模式）
用原型链实现对原型属性和方法的继承，用借用构造函数实现对实例属性的继承

```javascript
function SuperType(name){
  this.name;
  this.colors = [];
}


SuperType.prototype.sayName = function(){};


function SubType(name, age){
  //继承属性
  SuperType.call(this, name);


  this.age = age;
}


//继承方法
SubType.prototype = new SuperType();


SubType.prototype.sayAge = function(){};


var instance = new SubType('myName', 66);
```


![inheritance_2](http://img.blog.csdn.net/20160715123502990?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)


问题：
无论什么情况下都会调用两次超类型构造函数
同时，父类构造函数中的属性会被继承到子类的原型上



原型式继承：

基于已有的对象创建新对象，同时还不必因此创建自定义类型

```javascript
function object(o){
  function F(){}
  F.prototype = o;
  return new F();
}


var person = {
  name:'myName',
  friends:[]
};


var anotherPerson = object(person);
anotherPerson.name = 'anotherName';
```

ECMAScript5通过Object.create()规范原型式继承


问题：
与使用原型模式一样，包含引用类型的值会共享



寄生式继承：

将继承过程封装成函数，并增强对象

```javascript
function createAnother(original){
  var clone = object(original);
  clone.sayHi = function(){};
  return clone;
}


var person = {};
var anotherPerson = createAnother(person);
anotherPerson.sayHi();
```


问题：
不能做到函数复用，降低效率，与构造函数模式类似



寄生组合式继承：

使用寄生式继承来继承超类型的原型，再将结果指定给子类型的原型

```javascript
function inheritPrototype(subType, superType){  //参数为两个类型的构造函数
  var prototype = object(superType.prototype);
  prototype.constructor = subType;  //为创建的副本添加因重写原型而失去的constructor属性
  subType.prototype = prototype;
}


function SuperType(name){
  this.name = name;
  this.colors = [];
}


SuperType.prototype.sayName = function(){};


function SubType(name, age){
  SuperType.call(this, name);
  this.age = age;
}


inheritPrototype(SubType, SuperType);


SubType.prototype.sayAge = function(){};
```

只调用了一次SuperType的构造函数，并且避免了在SubType.prototype上面创建不必要的、多余的属性，同时保持原型链不变



参考：《JavaScript高级程序设计》（第3版）

