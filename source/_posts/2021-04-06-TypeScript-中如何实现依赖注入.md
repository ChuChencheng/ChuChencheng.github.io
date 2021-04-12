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

搜索资料的过程中，发现一个叫 [`reflect-metadata`](https://github.com/rbuckton/reflect-metadata) 的库，在 ts 的 [handbook](https://www.typescriptlang.org/docs/handbook/decorators.html#metadata) 也有相关的介绍，之前基本没用到 decorators 所以没注意。

搜过 Angular 与 Nestjs 的源码后，可以确定它们的依赖注入系统就是利用了这个实验性的 API 。

# 原理探索

## reflect-metadata

从这个库的 [Readme](https://github.com/rbuckton/reflect-metadata) 可以很清晰地看出它能做什么：

简单来说，它给开发者提供了一种能力，可以在定义一个 `class` 时通过 `Reflect.defineMetadata` 存储一些类型相关的数据，在实际调用的这个 `class` 的时候，通过 `Reflect.getMetadata` 获取之前定义的数据。要类比的话，有点像藏在 `class` 里的 `localStorage` 。

这里还涉及一个 [元编程](https://en.wikipedia.org/wiki/Metaprogramming) 的概念，简单地说，就是平常写程序，是处理外部输入的数据，而元编程提供了将程序当做数据的能力，也就是处理程序的程序。在 JavaScript 中，也不是什么新鲜的特性了， ES6 提供的 `Proxy`, `Reflect` 甚至之前的 `defineProperty` 等，就给开发者提供了元编程的能力。详见 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Meta_programming)

扯回正题，我们直接通过一个简单的例子看看 `reflect-metadata` 到底能做啥

```typescript
import 'reflect-metadata'

const Injectable = () => {
  return function (target: any) {
    Reflect.defineMetadata('say', 'meow', target)
  }
}

@Injectable()
class Cat {}

const instantiateCat = () => {
  const say = Reflect.getMetadata('say', Cat)
  console.log(say) // meow
}

instantiateCat()
```

通过以上这个例子可以看到， `Injectable` 通过 `Reflect.defineMetadata` 给 `Cat` 加了个 key 为 `say` 的 metadata

而在实例化的时候，通过 `Reflect.getMetadata` 就可以拿到定义的 metadata 了

那么，我们如果把 `constructor` 的参数定义为 metadata ，在实例化的时候也就知道要传入哪些参数了，就像下面的例子：

```typescript
import 'reflect-metadata'

const Injectable = (constructorArguments: any[]) => {
  return function (target: any) {
    Reflect.defineMetadata('args', constructorArguments, target)
  }
}

class Tail {}

@Injectable([Tail])
class Cat {
  constructor (
    private readonly tail: Tail,
  ) {}
}

const instantiateCat = () => {
  const args = Reflect.getMetadata('args', Cat)
  console.log(args) // [Tail]
}

instantiateCat()
```

但很显然，我们实际在写 Angular 或者 nest 的时候，是不会给 `Injectable` 传入 `constructor` 的参数的，那框架是如何知道参数信息的？

以下就是黑魔法了

## emitDecoratorMetadata

tsconfig 里有这么一个配置 [`emitDecoratorMetadata`](https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata) ，没有想了解依赖注入之前，完全没注意到这个是干啥的，加上官网文档中，其属于实验性的 API ，就更没想要了解了。

不过官网也指明了这个选项是跟 `reflect-metadata` 配合的，明显是我们要了解的、跟依赖注入有关的选项。

让我们接着以上的例子来说明，先把 `emitDecoratorMetadata` 在 `tsconfig.json` 中打开，然后运行以下示例：

```typescript
import 'reflect-metadata'

const Injectable = () => {
  return function (target: any) {
    // 移除 Reflect.defineMetadata
  }
}

class Tail {}

// 移除参数
@Injectable()
class Cat {
  constructor (
    private readonly tail: Tail,
  ) {}
}

const instantiateCat = () => {
  // args 改为 design:paramtypes
  const args = Reflect.getMetadata('design:paramtypes', Cat)
  console.log(args) // [Tail]
}

instantiateCat()
```

可以发现，我们把 `Injectable` 的参数去掉了，把 `Reflect.defineMetadata` 也移除了，效果还是一样，能读取到 `constructor` 的参数

ohhhhhhhhhhh

这时候可能会有个疑问， `Injectable` 啥也没做啊，能不能移除掉

答案当然是 不一定能

因为 `emitDecoratorMetadata` 选项是针对装饰器的，没有装饰器了，就没有作用了

当然，如果随便加一个其他乱七八糟的装饰器，那还是会起作用的

那么 `emitDecoratorMetadata` 这个黑魔法做了啥呢？我们在 TypeScript Playground 把代码贴上去看看会生成什么样的 JS 代码：

```javascript
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

// ***** 重点1 ******
var __metadata = (this && this.__metadata) || function (k, v) {
  // Reflect.metadata 是 Reflect.defineMetadata 的装饰器版本
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import 'reflect-metadata';
const Injectable = () => {
    return function (target) {
    };
};
class Tail {
}
let Cat = class Cat {
    constructor(tail) {
        this.tail = tail;
    }
};
Cat = __decorate([
    Injectable(),
    // ****** 重点2 ******
    __metadata("design:paramtypes", [Tail])
], Cat);
const instantiateCat = () => {
    const args = Reflect.getMetadata('design:paramtypes', Cat);
    console.log(args); // [Tail]
};
instantiateCat();
```

可以看到，生成的代码自动给我们加上了类似 `Reflect.defineMetadata('design:paramtypes', [Tail], Cat)` 的片段

所以后续实例化时，我们依然可以通过 `Reflect.getMetadata` 获取 `constructor` 参数

至此，整个黑魔法就解释完了

# 其他疑问

关于 TypeScript 依赖注入的黑魔法是清楚了，实际上，因为语言本身不支持，加上用得不多，所以第一次了解下来会感觉很魔幻，在其他语言中应该是很平常的做法。

还有一个跟依赖注入原理关系不大的问题：

`Injectable` 就这么放空？

当然不是，根据本人的合理推断， `Injectable` 内部做的应该是把当前 class 注册到管理依赖注入的系统中，提供给其他 class 注入使用。

以下是对这个猜想不负责任的一个简单实现，不代表框架内部就是这样做的

<iframe src="https://codesandbox.io/embed/modern-lake-3r7u9?expanddevtools=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2Findex.ts&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="modern-lake-3r7u9"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

```typescript
import 'reflect-metadata'

const providers: any[] = []
const instanceMap = new Map()

const Injectable = () => {
  return function (target: any) {
    if (!providers.includes(target)) {
      providers.push(target)
    }
  }
}

@Injectable()
class Yarn {
  roll () {
    console.log('yarn roll!')
  }
}

@Injectable()
class Tail {
  wag () {
    console.log('wag!')
  }
}

@Injectable()
class Cat {
  constructor (
    private readonly tail: Tail,
    private readonly yarn: Yarn,
  ) {
    tail.wag()
    yarn.roll()
  }
}

const instantiate = (target: any) => {
  const args = Reflect.getMetadata('design:paramtypes', target)
  const ctorArgs = (args || []).map((arg: any) => {
    if (!providers.includes(arg)) {
      throw new Error(`${arg} not injectable`)
    }
    const cache = instanceMap.get(arg)
    if (cache) return cache
    const instance = instantiate(arg)
    instanceMap.set(arg, instance)
    return instance
  })
  return new target(...ctorArgs)
}

const instantiateCat = () => {
  return instantiate(Cat)
}

instantiateCat()
```

# 参考

- [reflect-metadata](https://github.com/rbuckton/reflect-metadata)
- [Meta programming - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Meta_programming)
- [Metaprogramming - Wikipedia](https://en.wikipedia.org/wiki/Metaprogramming)
- [TypeScript: Documentation - Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html#metadata)
- [TypeScript: TSConfig Reference - Docs on every TSConfig option](https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata)
