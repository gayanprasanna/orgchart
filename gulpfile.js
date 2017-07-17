/**
 * Created by Gayan Prasanna on 7/11/17.
 */

//Grab gulp packages
var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');

var configuration = {
    production:!!gulpUtil.env.production
};
console.log(gulpUtil.env.production);
/*

 //A default gulp task to just log a messages

 gulp.task('default',function(){
 return gulpUtil.log('Gulp has started running');
 });*/

gulp.task('default', ['initializing','watch']);

gulp.task('watch', function () {
    gulp.watch('src/**/*.js', ['jshint']);
    gulp.watch('src/**/*.scss',['build-css'])
});

gulp.task('jshint', function () {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('initializing',function () {
    return gulpUtil.log('Initializing...');
});

gulp.task('build-css',function () {
    return gulp.src('src/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('style.css'))
        .pipe(configuration.production?csso():gulpUtil.noop())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/styles'))
});

gulp.task('build-js',function () {
    return gulp.src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(configuration.production?uglify().on('error', function(e){
            console.log(e);
        }):gulpUtil.noop())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'))
});