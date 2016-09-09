//引入gulp、gulp插件以及browser-sync
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    less = require('gulp-less'),
    plumber = require('gulp-plumber');
//创建一个新的gulp任务
gulp.task('serve',['less'],function(){
    //初始化项目跟目录为'./'（也可以使用代理proxy: "yourlocal.dev"）
    browserSync.init({
        server: './'
    });
    //创建gulp监听器，监听less文件的变化，自动执行'less'任务，编译less并生成css文件
    gulp.watch('./assets/less/*.less', ['less']).on('change', function(event){
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    //监听html文件的变化，自动重新载入
    gulp.watch('./*.html').on('change', browserSync.reload);
});
//创建自动编译less的任务，这边需要return stream以保证browserSync.reload在正确的时机调用
gulp.task('less', function(){
    return gulp.src('./assets/less/*.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest('./assets/css'))
        .pipe(browserSync.stream());
});
//默认启动的gulp任务数组['serve']
gulp.task('default', ['serve']);