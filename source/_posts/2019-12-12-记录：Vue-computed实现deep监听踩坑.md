---
title: 记录：Vue computed实现deep监听踩坑
date: 2019-12-12 14:59:03
tags:
  - vue
categories: 前端
---

# 背景

在写 Vue 组件的时候，其中的 computed 里面依赖了一个对象，例如：

```javascript
new Vue({
  el: "#app",
  data () {
  	return {
      date: {
      	start: null,
        end: null,
      },
    }
  },
  computed: {
  	dateRange () {
    	this.count++
    	return this.date
    },
  },
})
```

以上述代码为例， `dateRange` computed 属性依赖了 `date` 这个对象，理想情况下， `dateRange` 会随着 `date` 对象内容的改变而改变。

然而，当单独改变 `date.start` 或 `date.end` 时，`dateRange` 却没有做出响应，见下面的[示例][jsfiddle demo]：

<script async src="//jsfiddle.net/azureternite/865uom91/13/embed/js,html,result/dark/"></script>

# 原因分析

直接看 vue2 有关初始化 computed 部分的源码：

```javascript
const computedWatcherOptions = { lazy: true }

function initComputed (vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = vm._computedWatchers = Object.create(null)
  // computed properties are just getters during SSR
  const isSSR = isServerRendering()

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
    
    // 省略
  }
}
```

可以看到，初始化的 computed 实际上就是个不带 `deep` 的 `Watcher` ，所以在收集依赖的时候， `dateRange` 只收集到了 `date` ，而没有收集到 `date.start` 和 `date.end` ，因此也就不会对这两个属性的单独变化做出响应。

# 解决

那要怎么在 computed 里实现类似 deep 的效果呢？实际上，使用 computed 的一般不会是什么特别复杂的属性，否则直接用 `watch` 就行了。

对于这类 computed ，有两种十分简单的方案：

1. 改变对象时将整个对象一起改变，例如 `this.date = {}` ，而不是 `this.date.start = xxx`
2. 在 computed 里将希望监听的属性都访问一遍，调用对象深层属性的 getter 。例如在上述示例中，在 `dateRange` 中访问一遍 `this.date.start` 跟 `this.date.end` 即可。

可在[示例][jsfiddle demo]中将注释去掉查看 computed 触发更新效果。



[jsfiddle demo]: https://jsfiddle.net/azureternite/865uom91/13/
