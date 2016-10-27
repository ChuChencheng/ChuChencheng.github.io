---
title: Handlebars学习之——表达式
categories: Handlebars
tags: Handlebars
---

**Handlebars表达式是Handlebars模板的基本单元，可以单独在{{mustache}}中使用它，将它们传入Handlebars helper，或将它们作为hash arguments的值使用**

# 基本使用

```handlebars
<h1>{{title}}</h1>
```

这个表达式的意思是：在当前上下文中查找`title`属性

Handlebars也可以使用`.`来分隔标识符，这类表达式被称为path

```handlebars
<h1>{{article.title}}</h1>
```

这个表达式的意思是：在当前上下文中查找`article`属性，并在查找结果中查找`title`属性

也支持用`/`来分隔，但不推荐使用

标识符可以是任何Unicode编码的字符，除了：

```
空格 ! " # % & ' ( ) * + , . / ; < = > @ [ \ ] ^ ` { | } ~
```

要引用一个不是合法标识符的属性，可以用方括号`[`，如：

```handlebars
{{#each articles.[10].[#comments]}}
  <h1>{{subject}}</h1>
  <div>
    {{body}}
  </div>
{{/each}}
```

上述`articles.[10].[#comments]`相当于JavaScript中的`articles[10]['#comments']`

当使用{{expression}}时，handlebars会转义其中的html内容，而使用{{{expression}}}时不会转义

```handlebars
Handlebars.registerHelper('link', function(str){
    return '<span>'+ str +'</span>';
});

{{link 'hello'}}  //<span>hello</span>

{{{link 'hello'}}}  //hello
```

# Helpers

handlebars helper相当于一个函数，先在js代码中注册一个helper：

```javascript
Handlebars.registerHelper('link', function(str){
  return '<span>'+ str +'</span>';
});
```

然后在模板文件中调用helper，第一个标识符为注册的helper的名称，在本例中为"link"，后面跟着helper回调函数的参数，可以是0个或多个，用空格隔开

```handlebars
{{{link 'hello'}}}
```

此外，handlebars还可以接收一些可选的键值对序列作为helper回调函数最后一个参数的值（这在Handlebars中被称为hash arguments）。
hash arguments的key是一个普通的标识符，value则是一个Handlebars表达式，因此可以是标识符、path或字符串

模板文件中：

```handlebars
{{{hash 'hello' href='world'}}}
```

```javascript
handlebars.registerHelper('hash', function(str, options){
  console.log(options.hash);
});
```

输出

```javascript
{ href: 'world' }
```

# 子表达式

Handlebars支持子表达式，可以在一个mustache中调用多个helper，内层helper的返回结果将作为外层helper的参数传递

```handlebars
{{outer-helper (inner-helper 'abc') 'def'}}
```

# 控制空白

当在mustache语句的两侧使用`~`符号，可以去除那一侧的所有空白，直到遇到非空白字符或第一个handlebars表达式

示例：

上下文：

```javascript
{
  nav: [
    {url: 'foo', test: true, title: 'bar'},
    {url: 'bar'}
  ]
}
```

下列模板代码：

```handlebars
{{#each nav}}
  <a href="{{url}}">
    {{#if test}}
      {{title}}
    {{^}}
      Empty
    {{/if}}
  </a>
{{~/each}}
```

会输出：

```html
<a href="foo">
    bar
</a>
<a href="bar">
    Empty
</a>
```

使用`~`去除空白：

```handlebars
{{#each nav ~}}
  <a href="{{url}}">
    {{~#if test}}
      {{~title}}
    {{~^~}}
      Empty
    {{~/if~}}
  </a>
{{~/each}}
```

输出：

```html
<a href="foo">bar</a><a href="bar">Empty</a>
```

# 转义

这边说的转义并不是指html转义，而是输出模板语句，如直接输出`{{title}}`而不是输出`title`

Handlebars有两种转义方式：

* inline escapes
* raw blocks

inline escapes就是在mustache区块之前加一个反斜杠`\`

```handlebars
\{{escaped}}
```

raw blocks是用四个大括号`{{{{`将要转义的区块围住来进行转义

```handlebars
{{{{raw}}}}
  {{escaped}}
{{{{/raw}}}}
```

然后还要写一个helper：

```javascript
handlebars.registerHelper('raw', function(options) {
  return options.fn();
});
```

(这么多花括号看得眼睛都花了...)

# 参考

* [Handlebars.js: Minimal Templating on Steroids][]



[Handlebars.js: Minimal Templating on Steroids]: http://handlebarsjs.com/expressions.html
