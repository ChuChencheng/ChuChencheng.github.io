---
title: 页面两列布局高度填满
categories: 前端
tags: 前端 CSS
---

# 问题来源

昨天早上某面试提出的一个问题，脑子一热漏写了一个条件，心塞。

问题大概是写一个两列布局，左边固定，高度都是默认填满页面，右边内容高度超出浏览器窗口出现滚动条。

# 解决办法

今天仔细想了下，用浮动做的话，高度不好弄成填满的。折腾了一会儿，搞出两种方案（不使用js的）。

* 左侧：fixed，右侧：absolute，min-height:100%，width为calc(100% - [左侧的width])，同时margin-left也为左侧的width
* html的overflow-x设置为hidden，右侧就可以不用calc了，直接width: 100%，不过这样的话，右侧元素使用margin 0 auto居中就会向右边偏移，偏移的长度为左侧的width

测试代码：

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>test layout</title>
  <style type="text/css">
    *{
      padding: 0;
      margin: 0;
    }
    /*html{
      overflow-x:hidden;   
    }*/  /*方法2*/
    .left{
      position: fixed;
      top: 0;
      left: 0;
      width: 100px;
      height: 100%;
      background-color: red;
    }
    .right{
      position: absolute;
      width: calc(100% - 100px);  /*方法1*/
      /*width: 100%;*/  /*方法2*/
      min-height: 100%;
      margin-left: 100px;
      background-color: blue;
    }
    .center{
      width: 100px;
      background-color: yellow;
      margin: 0 auto;
    }
  </style>
  <script>
    window.onload = function(){
      var addBtn = document.getElementsByClassName('js-add-btn')[0];
      var delBtn = document.getElementsByClassName('js-del-btn')[0];
      var right = document.getElementsByClassName('right')[0];
      addBtn.onclick = function(e){
        var pNode = document.createElement('p');
        pNode.innerText = 'content';
        for(var i = 0; i < 20; i++){
          var cpNode = pNode.cloneNode(true);
          right.appendChild(cpNode);  
        }
      }
      delBtn.onclick = function(e){
        var children = right.children;
        var len = children.length;
        var delCount = len > 20 ? 20 : len;
        for(var i = 0; i < delCount; i++){
          right.removeChild(children[len - (i + 1)]);
        }
      }
    }
  </script>
</head>
<body>
  <div class="left">
    <p>left</p>
    <button class="js-add-btn">增加右侧内容</button>
    <button class="js-del-btn">删除右侧内容</button>
  </div>
  <div class="right">
    <div class="center">
      <p>centered content</p>
    </div>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
    <p>lots of content</p>
  </div>
</body>
</html>
```

jsfiddle： https://jsfiddle.net/g9j8mcf4/1/
