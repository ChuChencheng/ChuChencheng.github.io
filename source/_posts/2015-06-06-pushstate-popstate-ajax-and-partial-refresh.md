---
title: pushState()、popstate事件配合ajax实现浏览器前进后退页面局部刷新
categories:
- [前端]
- [JavaScript]
tags:
- 前端
- pushState
- popstate
---

最近研究pushState，看了网上的文章还是不怎么会用，于是自己摸索着理解使用，终于实现局部刷新同时前进后退。

首先说说pushState()，这个函数将当前的url等信息加入history堆栈中；
当点击浏览器的前进后退按钮时，会触发popstate事件，所以可以在onpopstate的时候使用ajax实现局部刷新前进后退。

我的方法(用jQuery)：
1、定义两个函数

```javascript
function ajaxLoad(){
//里面加载ajax
};
function setState(){
var stateobj = ({//里面存放url等信息，stateobj将作为pushState()的第一个参数
url:url,
title:title
});
window.history.pushState(stateobj,null,url);//将当前url加入堆栈中
};
```

2、正常浏览使用ajax时

```javascript
$('a').on('click',function(event){//假设点击a标签加载ajax
event.preventDefault();//防止跳转
ajaxLoad();
setState();
});
```

3、onpopstate

```javascript
window.addEventListener('popstate', function(event) {
var state = event.state;//取得目标url的state，这样就可以通过state.url等方式访问之前stateobj中的内容
ajaxLoad();
//注意：此处不要调用setState();了，因为在历史记录堆栈中跳转时不需要往堆栈中写入数据
});
```

注意：
setState()的作用是往历史记录堆栈中添加一条记录；
ajax载入进来的元素（如a、button标签等）如有事件要在载入后重新绑定事件；



前端小白学习时所得，如有更好的方法欢迎讨论，代码写得菜求轻喷~


