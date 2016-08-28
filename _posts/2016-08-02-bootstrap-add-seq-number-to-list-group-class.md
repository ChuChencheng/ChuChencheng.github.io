---
title: bootstrap如何给.list-group加上序号
---

在bootstrap中，我们可以使用不带任何class的<ol>跟<li>来创建一个有序列表，但是如果加上list-group类，样式有了，但列表前面的数字却没了。

Bootstrap给list-group-item应用了`display:block;` 所以显示不了序号，因此我们只要修改一下list item的display就能把序号找回来了

```css
        .list-group{
            list-style: decimal inside;
        }

        .list-group-item{
            display: list-item;
        }

```

如果把`list-style: decimal inside;`写成`list-style-type: decimal;`，序号会显示在框外

以下附上一段测试代码及效果图：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Bootstrap list</title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
    <style>
        .list-group{
            list-style: decimal inside;
        }

        .list-group-item{
            display: list-item;
        }
    </style>
</head>
<body>
<div class="container">
    <ul class="list-group">
        <li class="list-group-item">First</li>
        <li class="list-group-item">Second</li>
        <li class="list-group-item">Third</li>
    </ul>
    <!--Ordered list-->
    <ol>
        <li>First</li>
        <li>Second</li>
        <li>Third</li>
    </ol>
</div>
</body>
</html>
```

![效果图](http://img.blog.csdn.net/20160802095930742?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)


参考：

http://stackoverflow.com/questions/24230990/how-to-make-an-ordered-list-with-twitter-bootstrap-component