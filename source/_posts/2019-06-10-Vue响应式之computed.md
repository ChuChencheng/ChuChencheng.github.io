---
title: Vue响应式之computed
date: 2019-06-10 16:03:06
tags:
- vue
categories: 前端
---

# 关于 Props

props 的处理与 data 类似，因此不再单独水一篇。

# 需要弄清的问题

相信看过 Vue 文档的你，在看到计算属性那一章节时，一定会对一句话产生疑问：

> 计算属性是基于它们的响应式依赖进行缓存的。只在相关响应式依赖发生改变时它们才会重新求值。

为什么？怎么做到依赖改变时才重新求值的？

整理出来就是：

1. computed 一般我们写成一个函数，为何可以像一个属性一样去使用它。
2. computed 是如何做到相关响应式依赖改变时才去重新计算求值的。

我们还是先假设一个组件：

```html
<template>
  <div id="app">
    {{ foo }}
    {{ testComputed }}
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      foo: 'bar',
    }
  },
  computed: {
    testComputed () {
      return this.foo
    },
  },
}
</script>
```

# computed 初始化时都发生了什么

我们还是从 `initComputed` 开始看起：

```javascript
const computedWatcherOptions = { lazy: true }

function initComputed (vm: Component, computed: Object) {
  // ...省略部分代码
  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      // ...省略部分代码
    }
  }
}
```

可以看到，`initComputed` 中主要是 new 了一个 Watcher ，然后执行了 `defineComputed` 。

在看这个 Watcher 之前，先注意一下这行代码：

```javascript
const getter = typeof userDef === 'function' ? userDef : userDef.get
```

除了定义一个 computed 为函数，我们也可以直接定义其 getter/setter ，也就是说，当我们定义为函数时，其实是定义了这个 computed 的 getter ，这也就解释了第一个疑问。

## new Watcher

`initComputed` 实例化了一个 Watcher 对象，不过这个 Watcher 跟 `$mount` 时的 Watcher 有点不一样，computed 的 Watcher 传入了 `{ lazy: true }` 选项，这就导致实例化后不会马上执行其 getter ，也就是依赖不会马上被这个 watcher 收集到，那么收集依赖的过程应该是下一步，`defineComputed` 中进行了。

## defineComputed

```javascript
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
  const shouldCache = !isServerRendering()
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef)
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop
    sharedPropertyDefinition.set = userDef.set || noop
  }
  // ...省略部分代码
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

在这个函数中，最后在 vm 上定义了对应 computed ，而 getter ，在不是 SSR 的情况下是用 `createComputedGetter(key)` 来代替。

我们来看看 `createComputedGetter` 函数做了什么：

```javascript
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
```

看了这段好像看不出什么端倪，让我们从 `watcher.evaluate` 看起。

首先，watcher.dirty 是为 `true` 的，因为在 Watcher 中初始化时 watcher.dirty 是赋了 watcher.lazy 的值。

所以，如果有在模板中用到 computed ，则一开始就会进行一次 `evaluate` ：

```javascript
evaluate () {
  this.value = this.get()
  this.dirty = false
}
```

在重新评估 computed 值的过程中，会执行 `watcher.get` ，而在 get 函数中，会尝试去执行 getter ：

```javascript
try {
  value = this.getter.call(vm, vm)
}
```

也就是我们所定义的函数：

```javascript
testComputed () {
  return this.foo
}
```

在我们所定义的 getter 里，引用了 `this.foo` ，因此会去执行 `this.foo` 的 getter 。

在之前阅读 data 响应式时了解到，Vue 重写了 data 的 getter/setter ，其中，在 getter 中有这么一段：

```javascript
if (Dep.target) {
  dep.depend()
  if (childOb) {
    childOb.dep.depend()
    if (Array.isArray(value)) {
      dependArray(value)
    }
  }
}
```

在 `this.foo` 的 getter 中会执行 `dep.depend()` ，也就是会向 `this.testComputed` 的 watcher 中添加 `this.foo` 的 `dep` 依赖。

因此，在 `this.foo` 改变时，会调用 `this.testComputed` 的 watcher 的 `update` 方法，具体就是把 `dirty` 置为 `true` ：

```javascript
update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true
  } else if (this.sync) {
    this.run()
  } else {
    queueWatcher(this)
  }
}
```

然后，在 render 的过程中，执行 `this.testComputed` 的 getter ，也就是 `computedGetter` ，由于 `dirty === true` ，会重新执行一次 `evaluate` 。

如此，便达到了响应式依赖改变时才重新计算值，而不会重复计算的效果。

# 大致流程

![process](/images/posts/vue-computed-reactive.jpg)

初始化时，按照 ①②③④ 步骤执行。
而当 foo 改变时，则会执行 `dep.notify` ：

1. 通知 computed Watcher 把 `dirty` 置为 `true`
2. 通知 `$mount` 时的 Watcher 执行 `updateComponent` 函数进行渲染，即执行 ③④ 步骤
