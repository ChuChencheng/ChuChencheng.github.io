var gulp = require('gulp'),
    less = require('gulp-less');

gulp.task('less',function(){
    return gulp.src('./less/*.less')
    .pipe(less())
    .pipe(gulp.dest('./css'));
});

var watcher = gulp.watch('less/*.less',['less']);
watcher.on('change',function(event){
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

gulp.task('default',['less']);

