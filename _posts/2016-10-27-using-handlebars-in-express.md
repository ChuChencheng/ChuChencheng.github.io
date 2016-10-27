---
title: 在Express中使用Handlebars模板引擎
categories: Node.js Handlebars
tags: Express Handlebars hbs
---

# Handlebars介绍

> Handlebars 是 JavaScript 一个语义模板库，通过对view和data的分离来快速构建Web模板。它采用"Logic-less template"（无逻辑模版）的思路，在加载时被预编译，而不是到了客户端执行到代码时再去编译， 这样可以保证模板加载和运行的速度。Handlebars兼容Mustache，你可以在Handlebars中导入Mustache模板。

# 在Express中使用

在Express中使用Handlebars，有一个hbs模块，对Handlebars进行了包装，可以代替Express自带的jade或ejs模板引擎

安装

```bash
npm install hbs --save
```

在app.js中设置view engine

```javascript
app.set('view engine', 'hbs');
```

如果要在不同扩展名的文件中使用Handlebars（如.html文件）

```javascript
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
```

然后就可以在views文件夹中使用.hbs的模板文件了。

# 参考

* [Handlebars.js 模板引擎 | Ghost中文网][]
* [pillarjs/hbs: Express view engine wrapper for Handlebars][]



[Handlebars.js 模板引擎 | Ghost中文网]: http://www.ghostchina.com/introducing-the-handlebars-js-templating-engine/
[pillarjs/hbs: Express view engine wrapper for Handlebars]: https://github.com/pillarjs/hbs
