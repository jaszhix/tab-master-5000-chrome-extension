var gulp = require('gulp');
var uglify = require('gulp-uglify');
var webpack = require('webpack-stream');
var imagemin = require('gulp-imagemin');
var del = require('del');
var zip = require('gulp-zip');

var production = true;
var uglifyOpts = null;
if (production) {
  uglifyOpts = {
    compress: {
      warnings: false,
      drop_console: true,
      dead_code: true,
      unused: true,
      booleans: true,
      join_vars: true,
      negate_iife: true,
      sequences: true,
      properties: true,
      evaluate: true,
      loops: true,
      if_return: true,
      cascade: true,
      unsafe: true
    },
    output: {
      comments: false
    }
  };
}
gulp.task('build', ['build-bg'], function() {
  return gulp.src('./app/scripts/components/root.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(uglify(uglifyOpts))
    .pipe(gulp.dest('./app/scripts/'));
});
gulp.task('build-bg', function() {
  return gulp.src('./app/scripts/background.js')
    .pipe(webpack(require('./webpack.config.bg.js')))
    .pipe(uglify(uglifyOpts))
    .pipe(gulp.dest('./app/scripts/'));
});

gulp.task('copy', ['build'], function() {
  del.sync(['./dist/**/**/*']);
  return gulp.src('./app/**/*')
    .pipe(gulp.dest('./dist/'));
});
gulp.task('package', ['copy'], function() {
  del.sync(['./dist/scripts/components/', './dist/scripts/bg/']);
  return gulp.src('./dist/**/**/*')
    .pipe(zip('tm5k-dist-' + Date.now() + '.zip'))
    .pipe(gulp.dest('./dist/'));
});
gulp.task('watch', function() {
  gulp.watch('./app/scripts/components/*.{js,jsx,es6}', ['build']);
  gulp.watch('./app/scripts/bg/*.{js,jsx,es6}', ['build-bg']);
});

gulp.task('imgmin', function() {
  return gulp.src('./app/images/*.{png,jpg,gif}')
    .pipe(imagemin({
      optimizationLevel: 3,
      interlaced: true
    }))
    .pipe(gulp.dest('./app/images'));
});

gulp.task('default', ['watch'], function() {});
