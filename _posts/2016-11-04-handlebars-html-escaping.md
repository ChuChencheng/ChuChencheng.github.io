---
title: Handlebars学习之——HTML转义
categories: Handlebars
tags: Handlebars
---

# 场景

使用`{{expression}}`时，输出的内容会被转义，如：

```handlebars
<div>{{title}}</div>
```

context为

```javascript
{
  title: '<p>Hello world</p>'
}
```

结果生成html：

```html
<div>&lt;Hello world&gt;</div>
```

最终在页面上显示的就是字符串`<p>Hello world</p>`

如果不想进行html的转义，有两种方法：

* {{{
* SafeString

# {{{

在模板中将两个花括号替换成三个花括号，即可避免html字符串被转义

```handlebars
<div>{{title}}</div>
<div>{{{body}}}</div>
```

传入的context为

```javascript
{
  title: '<p>Hello world</p>',
  body: '<p>Hello world</p>'
}
```

生成的结果：

```html
<div>&lt;Hello world&gt;</div>
<div><p>Hello world</p></div>
```

页面上显示的就是

```
<p>Hello world</p>
Hello world
```

# SafeString

Handlebars提供一个SafeString方法，使用这个方法返回的值即便在{{expression}}中也不会被转义

Handlebars模板：

```handlebars
{{sayhi}}
```

JavaScript:

```javascript
Handlebars.registerHelper('sayhi', function(){
  var str = '<p>Hello world</p>';
  return new Handlebars.SafeString(str);
});
```




# 参考

* [Handlebars.js: Minimal Templating on Steroids][]




[Handlebars.js: Minimal Templating on Steroids]: http://handlebarsjs.com/