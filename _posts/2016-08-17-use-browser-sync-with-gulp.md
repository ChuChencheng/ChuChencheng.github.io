---
layout: default
title: 通过Gulp使用Browsersync实现浏览器实时响应文件更改
---

[TOC]
{:toc}

# Gulp是什么鬼

Gulp是一种基于node.js的构建工具，有关构建工具的概念请移步[什么是构建工具][]

Gulp的安装及基本使用，可参考[一点| gulp详细入门教程][],写得十分6，通俗易懂

# Browsersync又是什么鬼

Browsersync可以让浏览器实时响应所做的文件更改，包括html, js, css, less, sass等，并自动刷新页面
而且可以在多个浏览器、多个设备（PC、平板、手机等）下同时进行调试，是提高开发效率的利器

# 如何安装使用Browsersync

[官网][]上有各种安装使用方式，这边我用gulp

## 安装

1.全局安装

```bash
npm install -g browser-sync
```

2.在本地项目目录下安装，同时装一下gulp跟gulp的插件（如果有用到gulp插件的话，比如gulp-less）

```bash
npm install browser-sync --save-dev
npm install gulp --save-dev
npm install gulp-less --save-dev
```

## 使用

1.配置gulpfile.js

在项目根目录底下新建文件gulpfile.js，然后填入内容：

```javascript
//引入gulp、gulp插件以及browser-sync
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    less = require('gulp-less');
//创建一个新的gulp任务
gulp.task('serve',['less'],function(){
    //初始化项目跟目录为'./'（也可以使用代理proxy: "yourlocal.dev"）
    browserSync.init({
        server: './'
    });
    //创建gulp监听器，监听less文件的变化，自动执行'less'任务，编译less并生成css文件
    gulp.watch('./less/*.less', ['less']).on('change', function(event){
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    //监听html文件的变化，自动重新载入
    gulp.watch('./*.html').on('change', browserSync.reload);
});
//创建自动编译less的任务，这边需要return stream以保证browserSync.reload在正确的时机调用
gulp.task('less', function(){
    return gulp.src('./less/*.less')
        .pipe(less())
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});
//默认启动的gulp任务数组['serve']
gulp.task('default', ['serve']);
```

2.运行gulp

在项目根目录命令行执行`gulp`或`gulp default`
项目启动后在命令行中会输出Access URLs，包括本地跟外部访问的URL以及项目跟UI控制界面的URL
项目默认启动在http://localhost:3000
UI控制界面默认启动在http://localhost:3001

# 效果图

![browser-sync-demo](http://img.blog.csdn.net/20160817012323155)

# 参考

[一点| gulp详细入门教程][]
[Browsersync + Gulp.js][] 




[什么是构建工具]: http://blog.csdn.net/azureternite/article/details/52213589
[一点| gulp详细入门教程]: http://www.ydcss.com/
[官网]: https://www.browsersync.io/
[Browsersync + Gulp.js]: https://www.browsersync.io/docs/gulp