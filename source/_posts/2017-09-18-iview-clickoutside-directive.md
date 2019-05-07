---
title: iview clickoutside指令
tags:
- vue
- iview
categories: vue
---

# clickoutside指令介绍

iview里面有个clickoutside指令，用来处理点击元素外面的事件。

比如在cascader组件里的最外层div就用到了该指令

```vue
<div :class="classes" v-clickoutside="handleClose">
```

当用户点击了这个元素的外面，就会执行传到指令中的`handleClose`函数。

# clickoutside指令原理

首先来看一下该指令的源码：

```javascript
export default {
    bind (el, binding, vnode) {
        function documentHandler (e) {
            if (el.contains(e.target)) {
                return false;
            }
            if (binding.expression) {
                binding.value(e);
            }
        }
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    update () {

    },
    unbind (el, binding) {
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    }
};
```

定义了bind和unbind两个钩子函数。

有关Vue自定义指令钩子函数的知识参照[官方文档][vue custom-directive]

## bind

在bind函数中，给使用了该指令的元素添加了一个`__vueClickOutside__`属性。

然后在document上绑定了一个click事件，`documentHandler`。

该handler做了两件事：

1. 判断使用指令的元素中是否包含当前被点击的元素，如果是，说明用户点击的是元素里面，则return false停止事件冒泡
2. 判断使用指令的元素是否有绑定值，若有，则调用绑定的函数。

需要注意的是，绑定的值必须是一个函数，例如，上述cascader组件中的`handleClose`就必须是一个函数

因为`binding.value(e)`在此例中就相当于`handleClose(e)`（`binding.value`为指令的绑定值，在这里绑定了handleClose这个值）

## unbind

解绑，两个操作

1. 移除监听器，在bind中定义的`el.__vueClickOutside__`在这里作为removeEventListener的listener参数
2. 删除元素上的`__vueClickOutside__`属性




[vue custom-directive]: https://cn.vuejs.org/v2/guide/custom-directive.html
