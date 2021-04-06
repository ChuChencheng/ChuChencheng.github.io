---
title: TypeScript 中如何实现依赖注入
date: 2021-04-06 12:00:00
tags:
  - typescript
categories: 前端
---

# 背景

如果有接触过 Angular 或者 Node 服务开发，应该会知道，代码里一般是充满了装饰器的，并且利用控制反转实现了依赖注入。

这本身没什么问题，开发者写的都是一个个的 `class` ，至于什么时候实例化，都是交给框架去做。

但是有关注入的方式，让我怎么也想不通：

```typescript
import HttpService from 'nestjs'

class XXXService {
  constructor (
    private readonly httpService: HttpService,
  ) {}
}
```

就是框架在实例化 service 的时候，如何知道要给 constructor 传入什么的

# 试图分析

## 运行时固定传入参数？

由于 `HttpService` 在 `constructor` 中是作为 ts 的类型使用的，因此在运行时 js 是不知道其类型的

这个逻辑至少是确定的（后面打脸

那么，在实例化 `XXXService` 的时候，固定会传入一个 `httpService` 实例？

随着文档阅读下去、慢慢开始自己写代码后，很容易发现这个推断是站不住脚的：

1. 首先，在 `constructor` 中，第一个参数也可以是其他的 Service
2. 其次，使用依赖注入时，可以注入多个 Services ，跟 `constructor` 参数的顺序根本无关

例如：

```typescript
class XXXService {
  constructor (
    private readonly catsService: CatsService,
    private readonly dogsService: DogsService,
  ) {}
}

// Or

class XXXService {
  constructor (
    private readonly dogsService: DogsService,
    private readonly catsService: CatsService,
  ) {}
}
```

以上两种写法，效果是一样的，都会注入正确的 `catsService` 与 `dogsService` 实例。

所以，这个猜想是不成立的。

## 编译时特殊处理？

既然无法纯靠运行时达到依赖注入的效果，那么就是在编译的时候进行了特殊的处理？

之前有稍微听说过，在 Angular 中，把原生的 `setTimeout` 啥的都重写了来实现更新检测相关的机制，那么这样一个风格的开源框架，自己在编译的时候加点料好像也不是什么稀奇的事情。

有可能是 tsc 的时候有些钩子让开发者加料？又或者是 Angular 团队自己写了个 ts 的 compiler ？

不管是哪种方式，实现起来都挺魔幻的，让人一时无法想明白，而且自己维护 compiler 的话，成本应该也不小的。

而 nestjs 文档中有说明，其依赖注入的设计是参考的 Angular ，这么一看，难道 nest 用的 compiler 跟 Angular 一样？还是 nest 团队也自己搞了一套？

在猜想越发离谱的情况下，还是老老实实去搜搜到底是怎么实现的吧。

## TypeScript emitDecoratorMetadata 与 reflect-metadata

Todo
