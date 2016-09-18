---
title: div直接包裹行内元素高度变高的问题
---

# 问题的发现

最近搞一个页面，用div直接包裹了两个button，本以为很寻常的东西，div的高度却被莫名其妙的撑开了。

```html
<style>
  html{
    font-size: 100px;
  }
  button{
    font-size: 0.16rem;
  }
</style>
<div style="background-color:aqua;">
  <button>Button 1</button>
</div>
```
<style>
  html{
    font-size: 100px;
  }
  button{
    font-size: 0.16rem;
  }
</style>
<div style="background-color:aqua;">
  <button>Button 1</button>
</div>

想来想去怀疑是line-height的问题，于是查了一下，搜到zxx的一篇文章[CSS深入理解vertical-align和line-height的基友关系][]

于是把div的line-height设置成0，button的vertical-align设置成top或bottom，问题解决。

<style>
  #div2{
    line-height: 0;
  }
  #btn2{
    vertical-align: top;
  }
</style>
<div id="div2" style="background-color:aqua;">
  <button id="btn2">Button 2</button>
</div>

不过vertical-align设置成middle时button距离上边会有1px的间隙。

<style>
  #div3{
    line-height: 0;
  }
  #btn3{
    vertical-align: middle;
  }
</style>
<div id="div3" style="background-color:aqua;">
  <button id="btn3">Button 3</button>
</div>

研究中...

贴上测试代码

```html
<!doctype html>
<html>
<head>
<meta charset='utf-8'>
<title>test</title>
<style>
  html{
    font-size: 100px;
  }
  button{
    font-size: 0.16rem;
  }
</style>
</head>
<body>
<div style="background-color:aqua;">
<button id="btn1">button 1</button>
</div>
<br>
<style>
  #div2{
    line-height: 0;
  }
  #btn2{
    vertical-align: top;
  }
</style>
<div id="div2" style="background-color:aqua;">
  <button id="btn2">Button 2</button>
</div>
<br>
<style>
  #div3{
    line-height: 0;
  }
  #btn3{
    vertical-align: middle;
  }
</style>
<div id="div3" style="background-color:aqua;">
  <button id="btn3">Button 3</button>
</div>
</body>
</html>
```

# 参考

* [CSS深入理解vertical-align和line-height的基友关系][]



[CSS深入理解vertical-align和line-height的基友关系]: http://www.zhangxinxu.com/wordpress/2015/08/css-deep-understand-vertical-align-and-line-height/
