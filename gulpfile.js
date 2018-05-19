const gulp = require('gulp');
const pug = require('gulp-pug');
var ts = require('gulp-typescript');
const browserSync = require('browser-sync').create();


gulp.task('pug', function () {
    return gulp.src('index.pug')
        .pipe(pug())
        .pipe(gulp.dest('.'))
});

gulp.task('ts', function() {
    gulp.src(['main.ts'])
        .pipe(ts({
            noImplicitAny: true,
            outFile: 'main.js'
        }))
        .pipe(gulp.dest('.'))
});

gulp.task('serve', ['ts', 'pug'], function() {

    browserSync.init({
        server: ".",
        port: 3000,
    });
    gulp.watch('index.pug', ['pug']);
    gulp.watch("main.ts", ['ts']);
    gulp.watch("index.html").on('change', browserSync.reload);
    gulp.watch("style.css").on('change', browserSync.reload);
    gulp.watch("main.js").on('change', browserSync.reload);
});

gulp.task('default', ['serve']);