---
title: Handlebars学习之——块表达式
categories: Handlebars
tags: Handlebars
---

{% raw %}

**Block helper可以让你自定义迭代器和其他可以传入新的上下文的功能**

# 基本块

Block helper的定义方法是：在一个mustache中，以`#`开头，后面跟着helper的名称，然后对应的在一个mustache中以`/`开头，加上相同的名称作为这个块的结尾。

形如：

```handlebars
{{#hello}}
  {{item}}
{{/hello}}
```

在helper中，function接收一个hash参数options，而options有个fn方法，该方法可接收一个context参数来改变block中的上下文，返回一个类似于编译后的Handlebars模板，明确地说，就是一个字符串。

```javascript
Handlebars.registerHelper('hello', function(options){
  return options.fn(this);
});
```

在上面的代码中，我们给options.fn传入了一个新的上下文，这个新的context是this，就是代表当前的上下文，因此，如果当前的上下文是：

```javascript
{
  title: 'This is the title.',
  body: 'body',
  item: 'item'
}
```

那么block中的item标识符最终返回字符串`'item'`

注：以这种方式定义的helper，在模板中，可以使用path，如上面的`{{item}}`可以写成`{{./item}}`

# with helper(内置)

with helper会把传入的context直接调用，实现如下

```javascript
Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});
```

当处理json的时候用with比较方便

```handlebars
<div class="entry">
  <h1>{{title}}</h1>
  {{#with story}}
    <div class="intro">{{{intro}}}</div>
    <div class="body">{{{body}}}</div>
  {{/with}}
</div>
```

context:

```javascript
{
  title: "First Post",
  story: {
    intro: "Before the jump",
    body: "After the jump"
  }
}
```

# 简单迭代器

先来看一下内置的each helper是怎么实现的

```handlebars
<div class="comments">
  {{#each comments}}
    <div class="comment">
      <h2>{{subject}}</h2>
      {{{body}}}
    </div>
  {{/each}}
</div>
```

helper:

```javascript
Handlebars.registerHelper('each', function(context, options) {
  var ret = "";

  for(var i=0, j=context.length; i<j; i++) {
    ret = ret + options.fn(context[i]);
  }

  return ret;
});
```

其实就是在helper中遍历了一次context。明白了这一点，我们就可以对其进行改造，实现自定义的迭代器了。如：

```handlebars
{{#list nav}}
  <a href="{{url}}">{{title}}</a>
{{/list}}
```

context:

```javascript
{
  nav: [
    { url: "http://www.yehudakatz.com", title: "Katz Got Your Tongue" },
    { url: "http://www.sproutcore.com/block", title: "SproutCore Blog" },
  ]
}
```

helper:

```javascript
Handlebars.registerHelper('list', function(context, options) {
  var ret = "<ul>";

  for(var i=0, j=context.length; i<j; i++) {
    ret = ret + "<li>" + options.fn(context[i]) + "</li>";
  }

  return ret + "</ul>";
});
```

# 条件表达式

Handlebars中内置的if只能判断true/false，具体实现如下：

```handlebars
{{#if isActive}}
  <img src="star.gif" alt="Active">
{{else}}
  <img src="cry.gif" alt="Inactive">
{{/if}}
```

helper:

```javascript
Handlebars.registerHelper('if', function(conditional, options) {
  if(conditional) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
```

其中，`options.inverse`用来处理block中的else语句，对此，我们也可以实现自定义的条件helper来增强条件语句的功能

```javascript
Handlebars.registerHelper('equal' function(param1, param2, options) {
  if(param1 == param2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
```

```handlebars
{{#equal 'hello' 'world'}}
  <p>==</p>
  {{else}}
  <p>!=</p>
{{/equal}}
```

以上示例展示了判断两个变量相等或不等时执行的操作。

此外，Handlebars支持链式的条件语句，如

```handlebars
{{#if isActive}}
  <img src="star.gif" alt="Active">
{{else if isInactive}}
  <img src="cry.gif" alt="Inactive">
{{/if}}
```

# hash参数

hash arguments在之前的文章有提到过，就是将一些键值对序列作为helper回调函数最后一个参数的值，通过`options.hash`来访问。

```handlebars
{{#list nav id="nav-bar" class="top"}}
  <a href="{{url}}">{{title}}</a>
{{/list}}
```

```javascript
Handlebars.registerHelper('list' function(context, options) {
  var attrs = Em.keys(options.hash).map(function(key) {
    return key + '="' + options.hash[key] + '"';
  }).join(" ");

  return "<ul " + attrs + ">" + context.map(function(item) {
    return "<li>" + options.fn(item) + "</li>";
  }).join("\n") + "</ul>";
});
```

# 块参数

Handlebars 3.0的新特性。

```handlebars
{{#each users as |user userId|}}
  Id: {{userId}} Name: {{user.name}}
{{/each}}
```

这边`user`会取当前context的值，而`userId`会取当前遍历context的索引值。
有点类似于JavaScript里的Array.map

# raw helper

之前也提到过，用来转义的

```handlebars
{{{{raw-helper}}}}
  {{bar}}
{{{{/raw-helper}}}}
```

helper:

```javascript
Handlebars.registerHelper('raw-helper', function(options) {
  return options.fn();
});
```

输出：

```html
{{bar}}
```

# 参考

* [Handlebars.js: Minimal Templating on Steroids][]

{% endraw %}


[Handlebars.js: Minimal Templating on Steroids]: http://handlebarsjs.com/block_helpers.html