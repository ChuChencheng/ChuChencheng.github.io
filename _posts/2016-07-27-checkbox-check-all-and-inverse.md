---
title: checkbox全选与反选
categories: 前端
tags: checkbox html JavaScript
---

用原生js跟jquery实现checkbox全选反选的一个例子

原生js：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>checkbox</title>
</head>
<body>
<div id="check-all">
    <input type="checkbox" name="check-all">全选
</div>
<div id="sub-checkbox">
    <input type="checkbox" name="sub-checkbox">
    <input type="checkbox" name="sub-checkbox">
    <input type="checkbox" name="sub-checkbox">
    <input type="checkbox" name="sub-checkbox">
    <input type="checkbox" name="sub-checkbox">
</div>
<script>
    var checkAll = document.querySelector('[name=check-all]');
    var subCheckbox = document.querySelectorAll('[name=sub-checkbox]');

    //绑定全选、反选事件
    checkAll.addEventListener('change', function () {
        if (this.checked) {
            for (var i = 0; i < subCheckbox.length; i++) {
                subCheckbox[i].checked = true;
            }
        } else {
            for (var i = 0; i < subCheckbox.length; i++) {
                subCheckbox[i].checked = false;
            }
        }
    }, false);

    //绑定sub checkbox的事件
    for (var i = 0; i < subCheckbox.length; i++) {
        subCheckbox[i].addEventListener('change', function () {
            var checkboxnum = subCheckbox.length;
            var checked = document.querySelectorAll('[name=sub-checkbox]:checked').length;
            if (checkboxnum == checked) {  //如果选中的sub checkbox与全部的sub checkbox一样多，则勾选全选的checkbox
                checkAll.checked = true;
            } else {  //反之取消勾选
                checkAll.checked = false;
            }
        }, false);
    }
</script>
</body>
</html>
```

jquery（需引入jquery）：

```javascript
$(document).ready(function () {
    //checkbox select all
    $(document).on('change', '[name=check-all]', function () {
        if ($(this).prop('checked')) {
            $('[name=sub-checkbox]').prop('checked', true);
        } else {
            $('[name=sub-checkbox]').prop('checked', false);
        }
    });

    //sub checkbox
    $(document).on('change', '[name=sub-checkbox]', function () {
        var checkboxnum = $('[name=sub-checkbox]').length;
        var checked = $('[name=sub-checkbox]:checked').length;
        if (checkboxnum == checked) {
            $('[name=check-all]').prop('checked', true);
        } else {
            $('[name=check-all]').prop('checked', false);
        }
    });
});
```

思路都是一样的，给总复选框绑定事件实现全选反选功能；给子复选框绑定事件，当所有的子复选框都选中时总复选框勾选，当有一个子复选框被取消勾选时，总复选框取消勾选，这个功能是通过比较被选中子复选框数量跟所有子复选框数量来实现的。
需要注意的是jquery中获取checkbox勾选状态时用prop()，不用attr()。
绑定事件 由于querySelectorAll()返回的是一个NodeList，所以要写个循环一个节点一个节点绑定。
