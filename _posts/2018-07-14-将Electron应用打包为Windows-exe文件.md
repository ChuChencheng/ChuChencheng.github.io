---
title: 将 Electron 应用打包为 Windows exe 文件
tags: Electron
categories: 前端
---

# 背景

假设你已经写好了一个 Electron 应用，想要打包为安装包分发给用户。

# 安装 electron-builder

这里使用 `electron-builder` 来完成这项光荣的任务，首先安装 `electron-builder` 

```
yarn add electron-builder --dev
```

# 配置 package.json

如果你看过他们的[官方文档][electron-builder docs]就知道，下一步该配置 `package.json`

添加一个 `build` 字段

下面直接放出示例：

```javascript
"build": {
  "appId": "Your.App.Id",
  "productName": "Your product name",
  "directories": {
    // 输出 exe 的文件夹，默认是 dist 
    // 如果使用 webpack 配置了输出文件夹是 dist ，这边可以选择换一个输出文件夹
    "output": "output"
  },
  "win": {  // Windows
    "target": [
      {
        "target": "nsis", // target 默认是 nsis
        "arch": [
          "x64" // 如果需要打包 32 位，数组里加上 'ia32'
        ]
      }
    ],
    "icon": "build/icon.ico", // icon 地址
    "publish": {  // 发布配置，如果使用 Auto Update 应该需要配置
      "provider": "generic",
      "url": ""
    }
  },
  "nsis": { // nsis 配置
    // 是否非一键安装
    "oneClick": false,
    // 是否可以选择安装位置
    "allowToChangeInstallationDirectory": true
  },
  "files": [  // 需要打包进 exe 的文件，具体书写规则参照文档
    "dist/*",
    "build/icon.ico",
    "!node_modules"
  ]
}
```

[files 字段书写规则][electron-builder file-patterns]

或许还需要配置一个 `scripts` :

```javascript
"scripts": {
  "dist": "electron-builder"
}
```

# 打包

执行：

```
yarn dist
```

等待打包即可。

Note: 在打包过程中，有些必要的包可能会下载失败，请自行查看控制台输出，下载失败的文件到对应的位置，重新执行打包。

最后，根据上面的配置，会在 `output` 文件夹下看到 `unpacked` 文件夹跟 `.exe` 文件。如果配置了 `publish` (如上配置)，还会有个 `latest.yml` 文件，这个文件在使用 `electron-builder` 的[自动更新][electron-builder auto update]功能时会用到。



[electron-builder docs]: https://www.electron.build/
[electron-builder file-patterns]: https://www.electron.build/file-patterns/
[electron-builder auto update]: https://www.electron.build/auto-update
