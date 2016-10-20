---
title: webpack打包生成的bundle.js文件过大的问题
categories: 前端
tags: 前端 webpack
---

# 问题

使用webpack进行打包时，发现bundle.js竟然有2M多。

# 解决办法

网上有去除插件、提取第三方库、压缩代码等方法。

还有一个比较容易忽略的原因就是开了sourcemap

在生产环境中，应使用`devtool: false`

关闭sourcemap后bundle.js的大小从2.46M降到302k

![webpack bundle.js](http://img.blog.csdn.net/20161020142705217)

# 参考

* [彻底解决 webpack 打包文件体积过大 - 简书][]
* [用webpack打包后的文件为什么会非常大？ - React 中文][]



[彻底解决 webpack 打包文件体积过大 - 简书]: http://www.jianshu.com/p/a64735eb0e2b
[用webpack打包后的文件为什么会非常大？ - React 中文]: http://react-china.org/t/webpack/2214
