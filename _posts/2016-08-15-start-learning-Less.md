---
title: 初学Less
---

* 目录
{:toc}

**Less在CSS语法的基础上进行了扩展，主要包含：**

* Variables（变量）
* Mixins（混合书写）
* Nested Rules（嵌套规则）
* Functions & Operations（功能和操作）
* Client-side usage（客户端使用）
* Server-side usage（服务端使用）

# 使用Less

## Server-side usage

### npm安装

```bash
npm install -g less
```

### 命令行使用

输出到`stdout`，直接在控制台显示

```bash
lessc styles.less
```

保存为文件

```bash
lessc styles.less styles.css
```

如果需要压缩，要先安装clean-css插件，然后执行命令

```bash
lessc --clean-css styles.less styles.min.css
```

### 在代码中使用

```javascript
var less = require('less');

less.render('.class { width: (1 + 1) }', function (e, output) {
    console.log(output.css);
});
```

## Client-side usage

link中的rel设置成`stylesheet/less`
先引入less文件，再引入less.js脚本

```html
<link rel="stylesheet/less" type="text/css" href="styles.less" />
<script src="less.js" type="text/javascript"></script>
```

下载[less.js][]

**需要注意的是，在浏览器中使用Less虽然入门简单、开发便捷，但在实际项目中因为要考虑性能问题，一般推荐在服务端用node.js或其他第三方工具使用**

# 语言特性

## Variables

定义变量

```less
@nice-blue: #5B83AD;
@light-blue: @nice-blue + #111;

#header {
    color: @light-blue;
}
```

输出

```css
#header {
    color: #6c94be;
}
```

注意，Less中变量相当于“常量”，因为它们只能被定义一次

变量也可以用在选择器、属性名和字符串拼接中，用@{变量名}形式

```less
/*注意：如果定义成@dialog: .dialog-class;这种有连字符 - 的变量值
 *要写成@dialog: dialog-class;
 *然后这样使用：
 *.@{dialog}
 *否则编译会报错 NameError: variable @dialog is undefined
 *然而使用下划线 _ 则没有这个问题，这是个坑
 */
@dialog: .dialogClass;

@{dialog}{
    width: 200px;
}
```

结果

```css
.dialogClass {
  width: 200px;
}
```

## Mixins

一个规则集合应用到另一个规则集合中，例如

```less
.bordered {
    border-top: dotted 1px black;
    border-bottom: solid 2px black;
}
```

我们想要将这些属性应用到别的规则集合中，直接用类名（也可以是id）代替这些属性就行了

```less
#menu a {
    color: #111;
    .bordered;
}

.post a {
    color: red;
    .bordered;
}
```

可以定义不带参数或带参数的Mixin，供调用，不输出css

```less
//不带参数
.animal(){
    color: #000000;
}

//带参数
.dog(@h;@t){  //也可以用,进行分隔，但css中如background、border等样式属性支持属性值组，而,则作为属性值组元素分隔符，因此推荐使用;作为参数分隔符
    height: @h;
    border: @t;
}

#doge{
    .animal();
    .dog(5px;1px);
}
```

输出：

```css
#doge {
    color: #000000;
    height: 5px;
    border: 1px;
}
```

Mixin中内置了两个特殊的对象，`@arguments`和`@rest`
@arguments与JavaScript中函数的arguments对象类似，表示传入的所有参数
@rest则表示...参数

```less
.dog(@h;@rest...){
    height: @h;
    border: @rest;
}

.cat(@t;@s@c){
    border: @arguments;
}

#doge{
    .dog(5px;1px;solid;yellow);
}

#meow{
    .cat(1px;solid;white);
}
```

输出：

```css
#doge {
    height: 5px;
    border: 1px solid yellow;
}
#meow {
    border: 1px solid white;
}
```

## Nested Rules

```css
#header {
    color: black;
}
#header .navigation {
    font-size: 12px;
}
#header .logo {
    width: 300px;
}
```

在Less中可以写成

```less
#header {
    color: black;
    .navigation {
        font-size: 12px;
    }
    .logo {
        width: 300px;
    }
}
```

我们也可以在混合书写模式中使用伪选择器，用<font color="red">`&`</font>表示当前选择器的父选择器

```less
.clearfix {
    display: block;
    zoom: 1;

    &:after {
        content: " ";
        display: block;
        font-size: 0;
        height: 0;
        clear: both;
        visibility: hidden;
    }
}
```

## Operations

加减乘除算术运算可以在任何数字、颜色和变量上操作，如果可能，数学操作将会考虑单位，在操作前会进行换算，运算结果以最左边有定义的单位为准
如果单位无法换算或无意义，则会忽略单位


```less
// numbers are converted into the same units
@conversion-1: 5cm + 10mm; // result is 6cm
@conversion-2: 2 - 3cm - 5mm; // result is -1.5cm

// conversion is impossible
@incompatible-units: 2 + 5px - 3cm; // result is 4px

// example with variables
@base: 5%;
@filler: @base * 2; // result is 10%
@other: @base + @filler; // result is 15%
```

注意，乘法与除法在运算时不进行单位换算，因为在大多数情况下这两种操作是无意义的
比如：一个长度乘以另一个长度等于一个面，而css中不支持对这样的面操作，因此只会对数字进行运算，然后分配最左边有定义的单位
（好像很有道理，比如2cm * 3mm，如果进行单位换算，最终结果将是0.6cm<sup>2</sup>，而这个单位在css中暂时并没有卵用）

```less
@base: 2cm * 3mm; // result is 6cm
```

颜色的运算会分为rgba来运算，并且总会输出一个合法的颜色值，如果颜色值大于ff或小于00，都会被四舍五入成ff或00，对于alpha也是一样，总在1.0-0.0之间
注意：alpha值的运算未定义，因为在对颜色的数学操作的意义上没有达成一致，所以如果对alpha进行运算，可能达不到想要的结果，后期也可能会[改变][operations-on-alpha]

```less
@color: #224488 / 2; //results in #112244
background-color: #112244 + #111; // result is #223355
```

## Escaping

可以用任意字符串作为属性或变量的值，<font color="red">`~"任意字符串"`</font>或<font color="red">`~'任意字符串'`</font>将不会改变，主要用在css hack中

```less
.weird-element {
    content: ~"^//* some horrible but needed css hack";
}
```

结果：

```css
.weird-element {
  content: ^//* some horrible but needed css hack;
}
```

## Functions

Less提供了许多对颜色、字符串和数学操作的功能，使用方式十分直白（前提是你英语好）
具体可以在[Function Reference][]中查询

```less
@base: #f04615;
@width: 0.5;

.class {
    width: percentage(@width); // returns `50%`
    color: saturate(@base, 5%);
    background-color: spin(lighten(@base, 25%), 8);
}
```

## Namespaces and Accessors

可以在命名空间中定义一些属性供以后使用或分发

```less
#bundle {
    .button {
        display: block;
        border: 1px solid black;
        background-color: grey;
        &:hover {
        background-color: white
    }
  }
    .tab { ... }
    .citation { ... }
}
```

使用：

```less
#header a {
    color: orange;
    #bundle > .button;
}
```

注：在namespace中定义的变量不能通过#namespace > @var访问到

## Scope

Less中的作用域与其他编程语言类似，现在本地作用域中寻找变量或Mixin，若没找到，再到上一级作用域中寻找

## Comments

两种注释方法

* //行内
* /\*
    块级
    \*/

## Importing

import 可以导入其他文件，如果是.less文件，可以不写后缀

```less
@import "library";  // library.less
@import "typo.css";
```

# 参考

* [lesscss.org][]
* [前端构建：Less入了个门][]






[operations-on-alpha]: https://github.com/less/less.js/issues/2694
[Function Reference]: http://lesscss.org/functions/
[less.js]: https://github.com/less/less.js/archive/master.zip
[lesscss.org]: http://lesscss.org/
[前端构建：Less入了个门]: http://www.cnblogs.com/fsjohnhuang/p/4187675.html

