---
title: JavaScript对寄生组合式继承的理解
---

**有关JavaScript的几种继承方式请移步[JavaScript的几种继承方式][]**

# 原型链的缺陷

SubType.prototype = new SuperType();

这样做的话，SuperType构造函数中的属性也会变成SubType原型中的属性，而我们需要SubType原型只继承SuperType原型
还有一点就是引用类型值属性的共享

# 寄生组合式继承的理解

为了结合原型链、组合继承和寄生式继承的优点，可以新建一个临时的类temp，temp.prototype指向父类的Prototype，然后创建一个temp实例，并给它加上一个constructor属性
这样，相当于用原型链的方法继承temp，由于temp的构造函数为空，所以只继承了原型上的属性，构造函数上的属性再用call或apply来继承

于是，我们可以把封装继承的函数进行修改，不使用object()或Object.create()，便于理解

```javascript
//继承原型
function inheritPrototype(subType, superType){  //参数为两个类型的构造函数  
    var temp = function(){};
    temp.prototype = superType.prototype;
    var tempInstance = new temp();  //创建temp的实例tempInstance

    //给temp的实例tempInstance添加constructor属性，指向subType，虽然不是真的prototype.constructor，但是用来实现继承的效果是我们想要的
    tempInstance.constructor = subType;
    subType.prototype = tempInstance;  //原型链继承
}  
  
  
function SuperType(name){  
    this.name = name;  
    this.colors = [];  
}  
  
  
SuperType.prototype.sayName = function(){};  
  
  
function SubType(name, age){
	//继承构造函数中的属性  
    SuperType.call(this, name);  
    this.age = age;  
}  
  
  
inheritPrototype(SubType, SuperType);  
  
  
SubType.prototype.sayAge = function(){};
```

![寄生组合式继承](http://img.blog.csdn.net/20160811133914557)


# 不用temp，直接SubType.prototype = SuperType.prototype？

因为SubType.prototype直接指向了SuperType.prototype，所以改变子类prototype中的属性的话，父类prototype中的属性也会被改变

例子：

```javascript
//子类改变会影响父类的情况

function Animal(){
	this.species = 'animal';
}

Animal.prototype.color = 'red';

function Cat(){
	this.meow = 'meowmeowmeow';
}

function Dog(){
	this.bark = 'bow-wow';
}

Cat.prototype = Animal.prototype;
Dog.prototype = Animal.prototype;

var cat = new Cat();
var dog = new Dog();

console.log(cat.color);  //red
console.log(dog.color);  //red
console.log(Animal.prototype.color);  //red

Cat.prototype.color = 'blue';

console.log(cat.color);  //blue
console.log(dog.color);  //blue
console.log(Animal.prototype.color);  //blue


//修正：将SubType的原型指向temp的一个临时创建的实例

function Animal(){
	this.species = 'animal';
}

Animal.prototype.color = 'red';

function Cat(){
	Animal.call(this);
	this.meow = 'meowmeowmeow';
}

var temp = function(){};

temp.prototype = Animal.prototype;
var tempInstance = new temp();
tempInstance.constructor = Cat;

Cat.prototype = tempInstance;

var cat = new Cat();

console.log(cat.color);  //red
console.log(Animal.prototype.color);  //red

Cat.prototype.color = 'blue';

console.log(cat.color);  //blue
console.log(Animal.prototype.color);  //red
```


[JavaScript的几种继承方式]: http://blog.csdn.net/azureternite/article/details/51916673