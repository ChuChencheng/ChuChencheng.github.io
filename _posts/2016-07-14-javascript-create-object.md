---
title: JavaScript创建对象的几种模式
---

看《JavaScript高级程序设计》做的一些笔记

# 工厂模式：

```javascript
function createPerson(arguments){
  var o = new Object();
  o.name = name;
  o.age = age;
  o.sayName = function(){};
  return o;
}


var person1 = createPerson(arguments);
```

解决创建多个相似对象的问题


缺点：
没有解决对象识别问题



# 构造函数模式：

```javascript
function Person(arguments){
  this.name = name;
  this.age = age;
  this.sayName = function(){};
}


var person1 = new Person(arguments);
var person2 = new Person(arguments);
```

构造函数名大写字母开头
person1有constructor（构造函数）属性，指向Person
```javascript
person1.constructor == Person  //true
person1 instanceof Object  //true
person1 instanceof Person  //true
```
构造函数当做普通函数使用，属性和方法都添加给window


缺点：
每个方法在每个实例上都要重新创建一遍
person1.sayName == person2.sayName  //false



# 原型模式：

每个函数都有一个prototype属性，指向一个对象，这个对象可以包含特定类型所有实例共享的属性和方法

```javascript
function Person(){
}


Person.prototype.name = 'myName';
Person.prototype.age = 66;
Person.prototype.sayName = function(){};


var person1 = new Person();
var person2 = new Person();
person1.name == person2.name  //myName
```

![Create Object](http://img.blog.csdn.net/20160714155314757?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)


可以通过对象实例访问原型中的值，但不能通过对象实例重写原型中的值
```javascript
person1.name = 'newName';
person1.name  //newName（来自实例）
person2.name  //myName （来自原型）
```
访问属性时，若没有在实例中搜索到该属性，就会在原型中搜索并返回该属性
使用delete可以删除实例中的属性，此时再访问该属性则会返回原型中的属性
```javascript
delete person1.name；
person1.name  //myName （来自原型）
```


原型与in操作符：

通过对象能够访问属性时返回true（for-in返回能够通过对象访问的、可枚举的属性），无论是在实例中还是原型中


原型模式的一些方法：

```javascript
isPrototypeOf()
Person.prototype.isPrototypeOf(person1)  //true

Object.getPrototypeOf() 返回[[Prototype]]的值
Object.getPrototypeOf(person1) == Person.prototype  //true
Object.getPrototypeOf(person1.name)  //myName
```

hasOwnProperty() 检测一个属性是否存在于实例中
```javascript
person1.name = 'newName';
person1.hasOwnProperty('name');  //true
person2.hasOwnProperty('name');  //false
```

hasPrototypeProperty() 检测一个属性是否来自原型
```javascript
hasPrototypeProperty(person1,'name');  //false
hasPrototypeProperty(person2,'name');  //true
```

Object.keys() 取得对象上所有可枚举的实例属性

Object.getOwnPropertyNames() 获取所有实例属性，无论是否可枚举


原型的对象字面量写法

```javascript
function Person(){
}
Person.prototype = {
  name:'myName',
  age:66,
  sayName:function(){}
};
```


这种写法的constructor属性不再指向Person，而是指向Object构造函数
```javascript
var person3 = new Person();
person3 instanceof Person  //true
person3 instanceof Object  //true
person3.constructor == Person  //false
person3.constructor == Object  //true
```


缺点：
由于其共享的特性，对于包含引用类型值的属性，实例无法有属于自己的属性
例如属性中包含数组，若通过实例对象对数组进行修改，由于数组存在于prototype中，则会影响到所有的实例。



# 组合使用构造函数模式和原型模式(广泛使用)：

构造函数模式定义实例属性，原型模式用于定义方法和共享的属性

```javascript
function Person(arguments){
  this.name = name;
  this.age = age;
  this.friends = ['a','b'];
}


Person.prototype = {
  constructor:Person,
  sayName:function(){}
};
```





# 动态原型模式：

```javascript
function Person(arguments){
  //属性
  this.name = name;
  this.age = age;
  
  //方法
  if(typeof this.sayName != 'function'){
    Person.prototype.sayName = function(){};
    Person.prototype.otherFunction = function(){};
  }
}
```





# 寄生构造函数模式：

```javascript
function Person(arguments){
  var o = new Object();
  o.name = name;
  o.age = age;
  o.sayName = function(){};
  return o;
}




var person1 = new Person(arguments);
```
除了使用new和构造函数，这个模式跟工厂模式是一样的


例如要创建一个具有额外功能的Array，由于不能直接修改Array，可以这样：

```javascript
function SpecialArray(){
  var sa = new Array();
  sa.push.apply(sa,arguments);  //使用apply是因为push如果接收数组作为参数，会将整个数组当做一个元素push
  sa.newFunction = function(){};
}


var arr = new SpecialArray(arguments);
arr.newFunction();
```





# 稳妥构造函数模式(安全性考虑)：

```javascript
function Person(name,age){
  var o = new Object();
  o.sayName = function(){
    return name;
  }
  return o;
}


var person1 = Person(name,age);
person1.sayName();  //除了使用sayName()方法之外没其他办法访问到name的值
```



参考：《JavaScript高级程序设计》（第3版）