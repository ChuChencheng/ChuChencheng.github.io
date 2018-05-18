---
title: 在浏览器中模拟WebSocket行为
tags: websocket
categories: 前端
---

先挂上项目链接：[wsmock-js][]

# 背景

在一个前端项目开发过程中若用到了 ajax ，可以使用 [jquery-mockjax][] 、[mockajax][] 等库来拦截 ajax 请求，并模拟服务器返回一份自定义的模拟数据给浏览器。这个过程没有发起网络请求，却模拟了 ajax 过程的行为，定义好模拟数据后，只要照常使用 ajax 即可，基本覆盖了日常使用 ajax 的需要。

那么，同样的思路，在开发过程中如果用到了 WebSocket ，也可以设法拦截 WebSocket 请求，并返回事先定义好的模拟数据，从而不用等待后端开发完成再来进行调试。

# 思路

要拦截 WebSocket 请求，我首先得到的思路有

1. 通过浏览器插件拦截网络请求，并返回对应模拟数据 （未探索）
2. 重写进行 WebSocket 连接与数据交换的方法 （阅读上述两个 mock ajax 库源码了解的思路）

退一步说，还可以搭设一个本地服务器，在开发时将请求 URL 都指向本地，进行真实的 WebSocket 流程，不过这样不太符合上述背景中 “照常使用” 的要求， URL 需要在本地跟实际 URL 中切换。

另外能想到的是在系统层面做手脚，这个没考虑得这么多。

本文按照上述第 2 点思路进行开发。

# 优缺点

重写一个方法，也就是说将原来的方法进行了覆盖，这样，用户后面调用的都将是重写后的方法而不是原来的方法。

这么做的优点有：

1. 可定制。可以对原来的方法进行改造，比如加个钩子啥的，例如 Vue 对 Array 方法的重写 （但这里并没有真的覆盖原生方法，具体看 Vue 源码）
2. 可扩展。跟第一点有点类似，可以对重写的方法加入新的方法、功能等。

但是重写方法也是有挺明显的缺点的：

1. 需要实现原来的功能。重写的方法应该要在不影响本来的方法正常使用的情况下进行，让用户感受不到这个方法被重写过了 （这边也不一定就是了，看你要实现什么样的功能） ，这要求对原方法的实现有一定的了解，如果能直接继承或调用原方法是最好的。
2. 对原方法的后续跟踪。基于第 1 点的考虑，原来的方法若后续进行了功能上的扩展或变更，重写的方法应该进行跟进。

# 实现

本项目的实现参考 [WebSocket MDN 文档][] ，把里面的方法跟属性等基本重写了一遍。

## WebSocket 构造函数

`WebSocket` 构造函数接受两个参数，一个 `url` ，一个可选的 `protocols`

由于一执行 `new WebSocket()` 就会进行 `url` 的检查并建立连接，而继承 `WebSocket` 必须执行 `super()` 方法，为了不发起连接，只能对整个 `WebSocket` 进行重写。

重写构造函数的大致流程是：

```javascript
// 保存原生 WebSocket
const _WebSocket = window.WebSocket

// 重写 WebSocket
class WebSocket extends EventTarget {
  constructor (url, protocols) {
    if (url in mockSettingUrls) { // 如果定义了对于此 url 的模拟设置
    // 进入模拟 WebSocket 的流程
    // Mock code here...
    } else {  // 如果未对 url 定义模拟设置，则返回原生调用
      console.log(`No mock settings for '${url}', invoke native.`)
      return _WebSocket(url, protocols)
    }
  }
}
```

注：由于 `onopen`、`onmessage` 等事件的特殊性（重新定义后触发事件执行顺序不变）， `EventTarget` 需要一些自定义实现，此处参照 [MDN EventTarget 的简单实现][] 进行了小的改造

## 属性与常量

常量不用说，既然重写了整个 `WebSocket` ，直接把该定义的四个 `ReadyState` 常量再定义一遍就行。

至于属性，根据文档定义好默认值，在适当的时机进行变更。如果考虑到只读等这些特性，可以配合 `Object.defineProperty` 与 `descriptor` 使用实现。

## 方法

`WebSocket` 浏览器端只有两个方法：

* `send`
* `close`

当然，在模拟的 `WebSocket` 中的 `send` 不会发出请求，而是执行在模拟数据设置中自定义的函数来模拟服务器接收到浏览器发出的信息后执行的函数。

## 事件系统

根据 MDN 文档中的描述， `WebSocket` 是继承于 `EventTarget` 的，因此可以使用事件系统中的 `addEventListener`, `removeEventListener`, `dispatchEvent ` 这些方法。

而定义 `onopen`, `onmessage`, `onclose`, `onerror` 这些属性本质上是执行了 `addEventListener` 。但是重新赋值这些属性时，事件的执行顺序并不会改变，例如：

```javascript
const ws = new WebSocket('wss://xxx.xxx.xxx')
ws.onopen = () => { console.log('1') }
ws.addEventListener('open', () => { console.log('2') })
ws.onopen = () => { console.log('3') }

// result
// 3
// 2
```

就是说，onxxx 这些属性，在事件 handler 的哪个顺序定义，再次更改该属性时，它们还在那个位置，顺序不会变更。

因此这边实现了一个简易 `EventTarget` ，并添加了一些方法去实现上述特性。

## 模拟设置的定义

重写了 `WebSocket` ，接下来该考虑怎么实现模拟设置了，其本质上是在模拟服务器的行为，包括接收数据、返回数据或主动推送数据。

因此有三个主要因素：

* 接收数据的 handler
* 发送数据的方法
* 发送数据的时机

我们可以把设置定义为一个对象

```javascript
{
  url,
  receiver,
  sender,
  sendInterval,
}
```

其中，根据 `url` 跟内部生成的 `id` 来标识唯一（ `url` 支持正则的话，一个模拟设置可以匹配到多个 `WebSocket` 连接；或者多次定义具有相同 `url` 的模拟设置。因此还需要 `id` 来区分）

`receiver` 表示服务器接收数据的 handler ，模拟 `WebSocket` 每次执行 `send` 方法时，实际上还执行了这个方法，表示服务器接收到了浏览器的数据。

`sender` 是从服务器发送数据到浏览器的方法，其在适当的时机执行，通过预先定义的 `eventBus` 触发一个内部事件，通知浏览器端的 `WebSocket` 接收到数据了，使其触发 `message` 事件。

`sendInterval` 则定义了服务器发送数据的时机，根据使用 WebSocket 的场景来看，基本上有这些情况：

* 服务器收到数据后马上发送数据
* 服务器隔一定时间发送数据

因此这个字段可以是数字类型，或者一个特殊的字符串用来标识服务器收到数据后应马上发送数据。

其他发送时机差不多都是这两种情况的变种，可以在 `sender` 跟 `receiver` 中进行操控。

## 其他细节

* 数据、参数的校验，例如 `url`, `send` 数据的格式校验等
* `bufferedAmount` 属性的计算
* 异常、错误的抛出（这里我参考 Chrome 的错误提示信息跟错误类型）

# 效果

最后的效果就是这样：

```javascript
import wsm from 'wsmock-js'
 
wsm.mock({
  url: 'ws://echo.websocket.org',
  sendInterval: 'onreceive',
  receiver (data) {
    console.log(data)
  },
  sender () {
    this.response = 'This is a message sent by server.'
  },
})

/*-------------------------------------*/

const ws = new WebSocket('ws://echo.websocket.org')
ws.onmessage = (evt) => { console.log(evt.data) }
ws.send('test')

// console output
// "This is a message sent by server."
```

你也可以通过 `npm` 或 `yarn` 安装 `wsmock-js` 后，运行 `npm start` ，打开网页控制台查看效果，可以看到通过 `webpack-dev-server` 建立的连接因为没有模拟设置，因此不会被拦截模拟。

**注意：这个项目只应在开发阶段使用，在线上请移除该项目模块**

# 后续

后续想着支持一下常用的 WebSocket 库，比如 [socket.io][] ，但是其方法 API 比较多，还没仔细研究怎么实现，而且它并不是 WebSocket 的一个实现，与原生 WebSocket 不能互通。

> Note: Socket.IO is not a WebSocket implementation. Although Socket.IO indeed uses WebSocket as a transport when possible, it adds some metadata to each packet: the packet type, the namespace and the ack id when a message acknowledgement is needed. That is why a WebSocket client will not be able to successfully connect to a Socket.IO server, and a Socket.IO client will not be able to connect to a WebSocket server (like ws://echo.websocket.org) either. Please see the protocol specification [here](https://github.com/socketio/socket.io-protocol).

或许应该尝试其他思路来实现了。

<br/>

最后再放一下项目地址 [wsmock-js][] ，欢迎各位大佬们提出意见或建议。

# 参考

* [WebSocket MDN 文档][]
* [MDN EventTarget 的简单实现][]
* [jquery-mockjax][]
* [mockajax][]



[wsmock-js]: https://github.com/ChuChencheng/wsmock-js
[WebSocket MDN 文档]: https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket
[MDN EventTarget 的简单实现]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget#Example
[jquery-mockjax]: https://github.com/jakerella/jquery-mockjax
[mockajax]: https://github.com/angrytoro/mockajax
[socket.io]: https://socket.io/