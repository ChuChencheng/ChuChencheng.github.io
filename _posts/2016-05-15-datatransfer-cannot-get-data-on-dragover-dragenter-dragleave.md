---
title: dataTransfer.getData()在dragover,dragenter,dragleave中无法获取数据的问题
categories: 前端
tags: dataTransfer dragover
---

做拖拽相关效果时，想在ondragover时给被拖拽元素添加一些样式，于是在dragover事件的函数中通过dataTransfer.getData()获取在dragstart中设置的数据，然而发现dataTransfer.getData()所返回的数据为空。
查询资料发现dataTransfer.setData()中所设置的数据是存储在drag data store中，而根据W3C标准，drag data store有三种模式，Read/write mode, Read-only mode跟Protected mode。

W3C Working Draft中5.7.2.关于三种drag data store mode的定义

> A drag data store mode, which is one of the following:

> Read/write mode
For the dragstart event. New data can be added to the drag data store.

> Read-only mode
For the drop event. The list of items representing dragged data can be read, including the data. No new data can be added.

> Protected mode
For all other events. The formats and kinds in the drag data store list of items representing dragged data can be enumerated, but the data itself is unavailable and no new data can be added.


Read/write mode
读/写模式，在dragstart事件中使用，可以添加新数据到drag data store中。

Read-only mode
只读模式，在drop事件中使用，可以读取被拖拽数据，不可添加新数据。

Protected mode
保护模式，在所有其他的事件中使用，数据的列表可以被枚举，但是数据本身不可用且不能添加新数据。


这样就可以解释为什么dragover中dataTransfer.getData()返回的数据为空，以及在dragover时dataTransfer中的types不为0了，因为在除了dragstart,drop以外的事件，包括dragover,dragenter,dragleave中，drag data store出于安全原因处于保护模式，因此不可访问。
如果要实现dragover中访问dragstart中设置的数据，可以采用定义一个全局变量的方法，在dragstart中赋值，之后在dragend中清空。

另外，我在ondragover时，尝试给被拖拽元素添加class以改变其样式发现，虽然拖拽时class已经改变，但在拖拽过程中样式并没有改变，而是等到拖拽动作完成后，也就是drop之后样式才被应用上去，所以在dragover,dragenter,dragleave中做得更多的应该是对数据的处理，而不是应用效果。



另一个问题


我的项目在Chrome中所使用的情况完全符合上述描述，但是在运行如下代码时dragover,dragenter,dragleave中均可获取到dataTransfer中的数据。

```html
<!doctype html>
<html>
<head>

</head>
<body>
<li id="oSource" data-name="source element" draggable="true" 

style="display:block;cursor:pointer;width:80px;height:50px;">测试锚</li>
<div id="oTarget"><span>将测试锚拖曳到这里</span></div>
</body>
<script>
function $(dom) {
  return document.querySelectorAll(dom);
}

$("#oSource")[0].ondragstart = function(event)
{
  event.dataTransfer.setData("text", event.target.getAttribute("data-name"));
}

$("#oTarget")[0].ondragover = function(event)
{
  event.preventDefault();
  var sAnchor = event.dataTransfer.getData("text");
  console.log(sAnchor + " being dragged");
}

$("#oTarget")[0].ondrop = function(event)
{
  event.preventDefault();
  var sAnchor = event.dataTransfer.getData("text");
  console.log(sAnchor + " dropped");
  $("#oTarget")[0].innerText = sAnchor;
}
</script>
</html>
```


待解释。

————————————————————————
update 2016/5/15 18:42
关于上述问题

上面那个示例可以在dragover中通过dataTransfer.getData()获取数据的原因是我直接打开文档运行了，如果放到wamp中一样获取不到数据。



引用：

[HTML 5.1 W3C Working Draft, 3 May 2016](https://www.w3.org/TR/html51/editing.html#drag-and-drop)