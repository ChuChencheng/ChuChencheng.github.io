---
title: 关于新增元素使用jQuery on()方法重复绑定的问题
categories: 前端
tags: on jquery ajax
---

最近写ajax新增元素button绑定click事件的时候发现元素重新添加进来的时候会多执行一次事件函数，找了半天，怀疑是on()的问题，于是测试了一下，果然是因为on()的使用方式造成了有的新增元素会执行多次绑定事件函数。

当使用`$(document).find('target-selector').on(event,function);`时，必须在元素每次添加进来之后重新绑定，否则会无效。
而使用`$(document).on(event,selector,function);`时，只需执行一次绑定即可，可以在开头就写好绑定，对后面添加进来的元素都有效，如果在元素每次添加进来之后都绑定，则绑定了几次，触发事件的时候就会执行几次事件函数。

下面是一个测试来说明这个问题（需要jQuery）。

```html
<!DOCTYPE html>
<html>

  <head>
    <meta charset="utf-8" />
    <script type="text/javascript" src="js/jquery-1.11.1.min.js"></script>
    <title>Just a test.</title>
    <style>
      button {
        margin: 10px;
      }
    </style>
    <script>
      $(document).ready(function() {
        $('.addOnTest').click(function() {
          var buttons = '<button class="onTest1">使用.find().on(event,function)的按钮</button><button class="onTest2">使用.on(event,selector,function)的按钮</button>';
          $('.test').append(buttons);
        });
        $('.delOnTest').click(function() {
          $('.onTest1').remove();
          $('.onTest2').remove();
        });
        $('.ontest').click(function() {
          $(document).find('.onTest1').on('click', function() {
            alert('111');
          });
          $(document).on('click', '.onTest2', function() {
            alert('222');
          });
        });
      });
    </script>
  </head>

  <body>
    <div class="test">
      <button class="addOnTest">新增两种类型的按钮</button>
      <button class="delOnTest">删除两种类型的按钮</button>
      <br />
      <button class="ontest">为新增按钮绑定事件</button>
      <br />
    </div>
    <p>测试步骤：
      <br /> 1、点击“新增两种类型的按钮”新增两个不同类型的按钮
      <br /> 2、点击“为新增按钮绑定事件”分别为两个新增按钮绑定点击事件
      <br /> 3、分别点击新增的两个按钮，可以发现，两个按钮点击时都执行了绑定的事件（都有alert）
      <br /> 4、点击“删除两种类型的按钮”，再点击“新增两种类型的按钮”
      <br /> 5、分别点击新增的两个按钮，可以发现，第一个按钮不执行绑定事件（没有alert），第二个按钮执行了绑定事件（有弹出alert窗口）
      <br /> 6、点击“为新增按钮绑定事件”
      <br /> 7、分别点击新增的两个按钮，可以发现，第一个按钮执行了一次绑定事件（一个alert），而第二个按钮执行了两次（两个alert）
      <br />
    </p>
  </body>

</html>
```


所以，对新增的元素，要么每次都使用`.on(event,function);`绑定，要么只要使用`$(document).on(event,selector,function);`绑定一次就好了。

