---
title: 调试Electron+Vue项目
tags: Electron Vue
categories: 前端
---

# 说明

传送门：[搭建Electron+Vue项目][]

**如果使用了 electron-vue 搭建的项目，基本可以忽略本篇文章，推荐只看后面两个大标题**

**本文的 dev-server 参考了 electron-vue 中服务器的搭建方式**

通过上一篇文章，我们搭建了一个 Electron + Vue 项目，但是每次项目启动都要执行两条命令， `npm run build && npm start` 。或许你会说，这就是一条命令，是的没错，`webpack && electron .` 的确可以在一条命令中完成。但开发过程中，一个本地 server 是必不可少的（对这类项目来说），而带上一个 server 就不能通过 `xxx && xxx` 这样的形式实现了，因为 server 启动的时候会进行监听，导致下一条命令无法执行。

本篇文章主要致力于实现一条命令实现启动 server + electron 并实现调试（[concurrently][] 同学请你先坐下）。

# 搭建 Webpack-dev-server 实现热重载

平时我们调试 Vue 项目，启动一个 webpack-dev-server 就可以打开浏览器调试了，但是在 Electron 项目中，除了渲染进程，我们还需要启动主进程， dev-server 在项目中用来提供渲染进程的页面。

## 简单但麻烦的方法

webpack-dev-server 可以通过命令行启动，而主进程也是通过命令行启动，那么只要在两个不同的命令行窗口分别执行

```
webpack-dev-server --inline --hot --config webpack.config.dev.js

electron .
```

就可以了。

但是本文的目的是...

## 稍微复杂但便捷的方法

我们已经知道， server + electron 不能用 `xxx && xxx` 启动的原因是：

1. server 启动后会监听文件，从而阻塞了后面那条命令的执行
2. 两条命令有一定的顺序要求，需要启动 server 后再启动 electron

（注：顺序不一定有要求，你也可以先启动 electron ，但会看到空白的页面，等 server 启动后再在窗口中刷新即可正常显示）

因此我们需要实现以下几点：

1. 启动 server
2. server 启动后的某个时机启动 electron
3. 最好能将 electron 在控制台中打印的日志与 server 在同一个命令窗口中显示
4. 使用一条命令即可启动

我们可以通过一个 Node 脚本来实现。

### 通过 Node API 启动 server

webpack-dev-server 既可以通过命令行启动，也能通过 Node API 启动。

个人认为 webpack-dev-server Node API 文档不是特别详尽，可以参照其 [wiki][webpack-dev-server wiki] 跟阅读源码获得一些帮助。

以下是启动 server 部分的代码：

```javascript
const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')
const devConfig = require('./webpack.config.dev')

const startServer = () => {
  return new Promise((resolve, reject) => {
    devConfig.entry.app.unshift("webpack-dev-server/client?http://localhost:8086/", "webpack/hot/dev-server")
    const compiler = webpack(devConfig)
    const server = new webpackDevServer(compiler, {
      hot: true,
      before (app, ctx) {
        ctx.middleware.waitUntilValid(() => {
          resolve()
        })
      },
    })
    server.listen(8086)
  })
}
```

### 启动 electron

我们需要在与 server 同一个进程中启动 electron ，可以利用 Node 的 `child_process` 模块来执行。

[child_process 文档][]

我们使用 `spawn` 方法创建一个子进程启动 electron ，并在子进程关闭的时候结束当前进程，也就是 server 。

```javascript
const electron = require('electron')

const startElectron = () => {
  const electronProcess = spawn(electron, ['--inspect=5858', '.'])
  electronProcess.on('close', () => {
    process.exit()
  })
}
```

### 限制执行顺序

在 `startServer` 函数中，我们返回了一个 `Promise` ，在 `ctx.middleware.waitUntilValid` 中 resolve 了这个 Promise 。通过源码得知这边的 middleware 是一个 `webpack-dev-middleware` ，直到它可用了，即可启动 electron 子进程。

因此可以这样启动这两个命令：

```javascript
startServer().then(() => {
  startElectron()
}).catch(err => {
  console.log(err)
})
```

### 将 electron 日志输出到 server 命令窗口

通过上面代码可以得知，当前命令窗口只会打印当前进程的日志信息，即基本上是 server 的日志信息。

查询 [child_process 文档][] 可以得知 child_process 有 `stdout` 和 `stderr` 两个属性，并且可以监听其输出的内容（一般情况只需要关注这两个）。因此我们可以稍微改造一下 `startElectron` ：

```javascript
const startElectron = () => {
  const electronProcess = spawn(electron, ['--inspect=5858', '.'])
  electronProcess.stdout.on('data', data => {
    console.log(`Electron stdout: ${data}`)
  })
  electronProcess.stderr.on('data', data => {
    console.log(`Electron stderr: ${data}`)
  })
  electronProcess.on('close', () => {
    process.exit()
  })
}
```

至此，这个脚本就完成了，下面放出完整的脚本代码，基本上是参考了 `electron-vue` 的脚本代码，但没用 webpack-hot-middleware：

```javascript
/**
 * webpack-dev-server 实现热重载，服务器启动后启动 electron
 */
const electron = require('electron')
const { spawn } = require('child_process')
const chalk = require('chalk')
const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')
const devConfig = require('./webpack.config.dev')

let electronProcess = null

const startServer = () => {
  return new Promise((resolve, reject) => {
    devConfig.entry.app.unshift("webpack-dev-server/client?http://localhost:8086/", "webpack/hot/dev-server")
    const compiler = webpack(devConfig)
    const server = new webpackDevServer(compiler, {
      hot: true,
      before (app, ctx) {
        ctx.middleware.waitUntilValid(() => {
          resolve()
        })
      },
    })
    server.listen(8086)
  })
}

const startElectron = () => {
  electronProcess = spawn(electron, ['--inspect=5858', '.'])
  electronProcess.stdout.on('data', data => {
    console.log(chalk.blue('------ Electron info start ------'))
    console.log(chalk.blue(data))
    console.log(chalk.blue('------ Electron info end ------'))
  })
  electronProcess.stderr.on('data', data => {
    console.log(chalk.red('------ Electron error start ------'))
    console.log(chalk.red(data))
    console.log(chalk.red('------ Electron error end ------'))
  })
  electronProcess.on('close', () => {
    process.exit()
  })
}

startServer().then(() => {
  startElectron()
}).catch(err => {
  console.log(err)
})

```

将这段代码保存为 `dev.js` 放在项目根目录，在 `package.json` 中添加脚本 `"dev": "node ./dev.js"` ，后续即可通过

```
npm run dev
```

来启动调试服务

# 使用 Chrome 开发者工具调试渲染进程

Chrome 开发者工具是通过主进程中 `BrowserWindow` 实例的 `webContents.openDevTools` 方法打开的，从头开始是这样的：

```javascript
const win = new BrowserWindow({width: 800, height: 600})
  
// 然后加载应用的 index.html。
win.loadFile('index.html')
  
// 打开开发者工具
win.webContents.openDevTools()
```

启动后就可以看见熟悉的 Chrome 神器了，配合 webpack 配置中的 `devtool` source map ，就可以在 vue 文件中各种打断点了。

# 加载 Vue.js devtools

[Electron 文档 -- 开发工具扩展程序][]

这里面写得够清楚了，不再多说。

如果 `%LOCALAPPDATA%` 没法读取，就使用系统的绝对路径吧。

[electron-devtools-installer][] 也是个不错的选择。

需要注意的是，两种方式都是需要从 Chrome 商店下载扩展的，需要科学上网。

# electron . --inspect 调试主进程

根据 [Electron 文档 -- 调试主进程][] 的说法，我们可以用

```
electron . --inspect=5858
```

来调试主进程。

除了上述命令之外，我们还需要一个 `支持 V8 调试协议的调试器` 。

这个调试器，方便一点的，我们可以用 Chrome 浏览器直接来调试。

## 使用 Chrome 调试主进程

首先，打开 Chrome ，在地址栏里输入

```
chrome://inspect
```

看到如下界面，点击 `Configure`

![Chrome inspect]({{ 'assets/img/blog/2018-07-02-调试Electron+Vue项目-chrome-inspect.png' | prepend: site.baseurl }})

紧接着，新增一条

```
localhost:5858
```

这边的 `5858` 就是上面命令行执行的端口。

![Chrome inspect settings]({{ 'assets/img/blog/2018-07-02-调试Electron+Vue项目-chrome-inspect-settings.png' | prepend: site.baseurl }})

接下来启动上面的命令， `electron . --inspect=5858` ，即可在 Chrome 中看到 Remote Target 中多了个东西，点击 `inspect` 即可打开开发者工具，主进程的代码都在里面，可以进行调试，设置断点之类的。

![Chrome inspect settings]({{ 'assets/img/blog/2018-07-02-调试Electron+Vue项目-chrome-inspect-remote.png' | prepend: site.baseurl }})

## 使用 VSCode 附加在主进程上

在 VSCode 中，可以把调试器附加在 Electron 主进程中。

![VSCode attach]({{ 'assets/img/blog/2018-07-02-调试Electron+Vue项目-vscode-attach.png' | prepend: site.baseurl }})

进入 Debug 面板，添加配置，VSCode 会在根目录生成一个 `.vscode` 文件夹，并包含一个 `launch.json` 文件，这就是 VSCode debug 时的配置文件。

打开 `launch.json` ，在 `configurations` 中填入： 

```javascript 
{
  "type": "node",
  "request": "attach",
  "name": "Inspect Electron",
  "port": 5858,
  "sourceMaps": false,
  "localRoot": "${workspaceRoot}",
  "remoteRoot": null,
  "address": "localhost"
}
```

然后保存。

现在，你可以在 VSCode 中按 `F5` 键启动调试器，并在 VSCode 中对主进程的代码打断点进行调试了。当然，这是在启动了 Electron 的前提下进行的调试，你还是需要先手动执行 `electron . --inspect=5858` 。

# 使用 VSCode 调试主进程

开头我们已经写好了一个启动 dev-server 后再启动 Electron 的脚本，在 VSCode 中，我们可以利用其调试器来启动这个脚本，并且直接在 VSCode 中调试主进程。

与上面使用附加的方式不同，这次我们使用 launch 。

`launch.json` `configurations` ：

```javascript
{
  "type": "node",
  "request": "launch",
  "name": "启动程序",
  "cwd": "${workspaceRoot}",
  "program": "${workspaceFolder}/dev.js",
  "autoAttachChildProcesses": true
}
```

注意最后一行 `"autoAttachChildProcesses": true` ，由于我们的脚本是通过子进程启动的 Electron ，这一行配置告诉 VSCode 自动附加到子进程上，也就是脚本启动的 Electron 进程，这相当于 “启动 dev.js + 附加到 Electron 进程” ，因此我们可以直接在 VSCode 中调试主进程。

有关 `launch.json` 配置见 [VSCode 文档][]




[搭建Electron+Vue项目]: {% post_url 2018-07-02-搭建Electron+Vue项目 %}

[concurrently]: https://github.com/kimmobrunfeldt/concurrently
[webpack-dev-server wiki]: https://github.com/webpack/docs/wiki/webpack-dev-server
[child_process 文档]: https://nodejs.org/dist/latest-v8.x/docs/api/child_process.html
[Electron 文档 -- 开发工具扩展程序]: https://electronjs.org/docs/tutorial/devtools-extension
[electron-devtools-installer]: https://github.com/MarshallOfSound/electron-devtools-installer
[Electron 文档 -- 调试主进程]: https://electronjs.org/docs/tutorial/debugging-main-process
[VSCode 文档]: https://code.visualstudio.com/docs/editor/debugging#_launch-configurations
