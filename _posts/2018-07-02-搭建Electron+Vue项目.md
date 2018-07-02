---
title: 搭建Electron+Vue项目
tags: Electron Vue
categories: 前端
---

# 说明

本文记录了从一个 `package.json` 开始搭建一个 Electron + Vue 项目的过程。

如果不想这么麻烦，可以直接使用 [Electron-vue][] 项目生成脚手架，里面包含了各种开发工具，包括 Vue.js devtools, 热重载 等。

[Electron 文档][]

# init 项目

首先在根目录 `npm init` 一下，创建 `package.json` 文件

然后安装 `Electron`：

`npm i electron --save-dev`

或者

`yarn add electron --dev`

安装过程由于不可抗力因素可能较慢或者下载失败，可以尝试[其他安装方式][Electron 安装]

# Electron 应用结构

简单来说，Electron 应用有两种进程类型：**主进程**和**渲染进程**

主进程就是从 `package.json` 中 `main` 入口执行的进程。

渲染进程则是负责 web 页面的运行的。

简单了解这两个概念后，我们围绕这两个进程来组织目录结构，在根目录的 `src` 目录下创建 `main` 和 `renderer` 两个文件夹，分别对应主进程和渲染进程。

# 创建主进程入口

在 `src/main` 文件夹下创建 `index.js` 作为主进程入口，同时在 `package.json` 中将 `main` 字段对应修改为 `src/main/index.js` 。

然后在 `src/renderer` 文件夹下创建 `index.html` 作为窗口界面的入口。

接下来可以按照 [Electron 教程][] 中写的内容来编写 `src/main/index.js` 跟 `src/renderer/index.html` 然后试着运行一下。

记得 
`win.loadFile('index.html')` 这句路径需要修改为 `src/renderer/index.html` ，然后 `package.json` `scripts` 中加上 `"start": "electron ."`

# 在项目中使用 Vue

接下来的步骤，基本上可以忘记主进程，先专注于渲染进程的东西了。

Electron 的渲染进程运行的就是一个 web ，也就是说我们只是在 Electron 项目中套用了一套 Vue 项目，你可以把 `renderer` 文件夹当做一个 Vue 项目的 `src` 文件夹。

## 安装依赖

首先安装各种依赖，根据需要装上 Vue 全家桶或者部分。

![依赖](./assets/img/blog/2018-07-02-搭建Electron+Vue项目-dependencies.png)

## 配置 webpack

webpack 配置跟平时 Vue 项目的配置类似，这边是我项目开发环境的配置（配置文件位置在根目录）：

```javascript
const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: '#cheap-module-eval-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 8086,
  },
  entry: {
    app: ['./src/renderer/index.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  node: false,
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.join(__dirname, 'src/renderer'),
    },
    extensions: ['*', '.js', '.vue', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({ template: 'src/renderer/index.html' }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  target: 'electron-renderer',
}

```

注意：

*  `entry` 的路径跟 `plugins` 中的路径，即有涉及路径的地方都要相应修改为 `renderer` 目录下。

*  `target` 设置成 `electron-renderer`。有关 `target` 可以参照 [webpack target][]

* 如果你需要访问当前 Electron 运行的进程变量 `process`，而不是 `webpack` 提供的变量（例如需要获取当前 Electron 应用使用的 node、 Chrome 与 Electron 版本，需要访问 `process.versions`），需要将 `node` 设置为 `false` 。参照 [webpack node][]


你也可以使用 webpack 来构建主进程，在此就不多说了。

## 使用 Vue 编写界面

这一步就是熟悉的一步了，从上面的 webpack 配置可以看到，`entry` 为 `src/renderer/index.js`，这就是 Vue 项目的入口文件。

还记得 `src/renderer/index.html` 吗，在 webpack 配置中，我们把它作为 `HtmlWebpackPlugin` 的模板，最后生成为 `dist/index.html`，因此我们可以把里面 `body` 的内容简单替换为：

`<div id="app"></div>`

就像平时写 Vue 项目那样。

## 修改主进程中 loadFile 路径

在 `src/main/index.js` 中，也就是主进程的入口文件，将 `win.loadFile` 的路径修改为 webpack 编译后的路径，也就是 `dist/index.html` 

# 运行应用

做了这么多，终于可以完整运行了。

在 `package.json` 中的 `scripts` 中加入 `build`：

```javascript
"scripts": {
  "build": "webpack --config webpack.config.js",
  "start": "electron ."
}
```

在命令行中按顺序执行这两个脚本即可启动应用

`npm run build && npm start`

# 调试

本文的任务完成了，调试篇参照 [调试Electron+Vue项目][]




[Electron-vue]: https://github.com/SimulatedGREG/electron-vue
[Electron 文档]: https://electronjs.org/docs
[Electron 安装]: https://electronjs.org/docs/tutorial/installation
[Electron 教程]: https://electronjs.org/docs/tutorial/first-app
[webpack target]: https://webpack.docschina.org/configuration/target
[webpack node]: https://webpack.docschina.org/configuration/node/
[调试Electron+Vue项目]: ./2018-07-02-调试Electron+Vue项目.md
