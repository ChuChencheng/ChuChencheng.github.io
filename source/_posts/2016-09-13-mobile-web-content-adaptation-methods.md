---
title: 移动端Web适配的两种做法思路总结
categories: 前端
tags:
- 前端
- 移动端适配
---

**看了几篇文章，理一下网易跟淘宝移动端适配的思路，主要是参考 [从网易与淘宝的font-size思考前端设计稿与工作流][]**

# 像素相关概念

## 物理像素(physical pixel)

>一个物理像素是显示器(手机屏幕)上最小的物理显示单元，在操作系统的调度下，每一个设备像素都有自己的颜色值和亮度值。

其值也就是我们常说的分辨率

## 设备独立像素(density-independent pixel)

>设备独立像素(也叫密度无关像素)，可以认为是计算机坐标系统中得一个点，这个点代表一个可以由程序使用的虚拟像素(比如: css像素)，然后由相关系统转换为物理像素。

简称dip，也可以称为CSS像素

## 设备像素比(device pixel ratio)

>设备像素比(简称dpr)定义了物理像素和设备独立像素的对应关系，它的值可以按如下的公式的得到：

```
设备像素比 = 物理像素 / 设备独立像素 // 在某一方向上，x方向或者y方向
```

# 网易的做法

## 目的

css中使用的尺寸与设计稿保持一致，body的宽度设为屏幕宽度

## 原理

将页面宽度定为屏幕宽度，通过设置html的font-size与使用rem来实现尺寸与设计稿一致

## 思路

* 假设设计稿宽度为640px
* 那么以设计稿为准，设置body的宽度为640px
* 由于使用rem单位，因此需要设置html标签的font-size
* 为计算方便，取100px为参照，所以body的宽度为6.4rem
* 由于设备的dip!=设计稿宽度，因此font-size=deviceWidth/6.4
* css尺寸为：设计稿标注尺寸/100

# 淘宝的做法

## 目的

页面大小与设计稿保持一致

## 原理

设置meta viewport中的scale保证页面大小与设计稿一致，使用rem

## 思路

* meta viewport中device-width的算法为：设备的物理分辨率/(devicePixelRatio * scale)
* 而每台设备的devicePixelRatio都是已知的，可通过window.devicePixelRatio获取
* JavaScript动态计算设置scale，包括initial-scale，maximum-scale，minimum-scale
* 动态设置html的font-size，为屏幕分辨率/10
* css尺寸为：设计稿标注尺寸/html的font-size

# 关于font-size能不能使用rem的问题

流云诸葛在文章中说font-size不能使用rem，要用media query，而实际上，网易的font-size也是有用rem来作为单位的。

那么为什么会说font-size不能使用rem呢？到底能不能用rem？

答案是**能**的。

说不能可能是因为在网页中有可能使用了[点阵字体][]，也叫位图字体，由于位图的缘故，点阵字体很难进行缩放。
这个概念与[矢量字体][]相对应。

网上有给出对于文字使用px的原因的文章

>根据以下两个原因，对于文字使用px：

>* 在大屏设备希望看到更多的文字
>* 中文点阵最好是在12px，14px，16px这种尺寸，使用rem就会无法避免使用13px，15px尺寸，这样文字会显示的很奇怪

虽然如此，但没有使用点阵字体的话，在一些情况，比如在需要自适应的情况下，使用rem也是没问题的。

# 关于font-size的更新（2016-09-14 11:50）

前面说到font-size能不能使用rem，给出的答案是 能。

但是经过一番摸索，这边我还是建议字号用px来作为单位。

为什么呢，除了点阵字体的原因，我们在使用rem时，在不同设备的字体大小不一样，而比较适合阅读的字号大小是14px或16px之类。

比如：iPhone5的设计稿是640px，那么根据网易的做法，html的font-size就是50px，那么我们根据设计稿定义一段文本的font-size为0.16rem，换算成px就是0.16 * 50 = 8 px，这样，在4吋iPhone上看这段文本时，就会显得很小；如果设置成0.32rem，在4吋iPhone上看是正常了，但是在较大屏幕上看，又会显得太大。

还有一个原因，使用rem最终是转换成px的，这样，转换后的px就有可能出现存在小数的情况，这个时候就可能出现1px的不对称。

因此我们在给文本定义字号时还是使用px，应对不同设备，使用media query，或者像淘宝的那种做法，在html中加上data-dpr，算出当前设备的dpr，再根据不同dpr来区分文本字号大小。

```javascript
.a{
  font-size:12px;
}
[data-dpr="2"] .a{
  font-size: 24px;
}
[data-dpr="3"] .a{
  font-size: 36px;
}
```

# 参考

* [从网易与淘宝的font-size思考前端设计稿与工作流 - 流云诸葛 - 博客园][从网易与淘宝的font-size思考前端设计稿与工作流]
* [移动端高清、多屏适配方案 - Div.IO][]
* [webapp font-size解决问题的方案][]
* [H5自适应改造方案——rem方案][]
* [移动端适配方案(上)][]
* [移动端适配方案(下)][]



[从网易与淘宝的font-size思考前端设计稿与工作流]: http://www.cnblogs.com/lyzg/p/4877277.html
[点阵字体]: https://zh.wikipedia.org/wiki/%E7%82%B9%E9%98%B5%E5%AD%97%E4%BD%93
[矢量字体]: https://zh.wikipedia.org/wiki/%E7%9F%A2%E9%87%8F%E5%AD%97%E4%BD%93
[移动端高清、多屏适配方案 - Div.IO]: http://div.io/topic/1092
[webapp font-size解决问题的方案]: http://blog.csdn.net/huang100qi/article/details/49886713
[H5自适应改造方案——rem方案]: https://github.com/imweb/mobile/issues/3
[移动端适配方案(上)]: https://github.com/riskers/blog/issues/17
[移动端适配方案(下)]: https://github.com/riskers/blog/issues/18
