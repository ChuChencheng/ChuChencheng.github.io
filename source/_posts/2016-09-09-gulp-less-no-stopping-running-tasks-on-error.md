---
title: gulp-less解决遇到错误停止执行task
categories:
- [构建工具]
- [前端]
tags:
- 构建工具
- gulp
- gulp-less
- gulp-plumber
---

# 来龙去脉

在用less+gulp开发时，有时候代码还没写完整，不小心保存了一下，然后gulp就开始执行gulp-less的task。
但是代码是有问题的，这时候会输出一个Potentially unhandled rejection，告诉你哪里出问题了，然后，
然后就挂了！！pipe就会停止输入数据，整个task就停止了。
特别是我用Sublime，设置了失去焦点自动保存，很容易出现这个问题。

# 解决办法

[gulp-plumber]插件解决了这个问题。
插件作者的想法 [Error management in gulp][]

使用方法：

先npm下载下来

```bash
npm install gulp-plumber --save-dev
```

在gulpfile.js中，引入gulp-plumber，然后在处理less的task中加上：

```javascript
var plumber = require('gulp-plumber');

gulp.task('less', function(){
    return gulp.src('./less/*.less')
        .pipe(plumber())  //加上这句
        .pipe(less())
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});
```

# 参考

* [gulp-less 开发使用中的问题 - SegmentFault][]
* [gulp-less插件自动编译跑着跑着挂了？ - 前端开发 - 知乎][]



[gulp-plumber]: https://github.com/floatdrop/gulp-plumber
[Error management in gulp]: https://gist.github.com/floatdrop/8269868
[gulp-less 开发使用中的问题 - SegmentFault]: https://segmentfault.com/q/1010000002989913
[gulp-less插件自动编译跑着跑着挂了？ - 前端开发 - 知乎]: http://www.zhihu.com/question/40091117
