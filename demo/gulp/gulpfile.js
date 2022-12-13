'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const exec = require('gulp-exec');

gulp.task('styles', () => {
  return gulp.src('src/public/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/public'));
});

gulp.task('default', gulp.series(['styles']));
gulp.task('watch', () => {
  gulp.watch('src/public/**/*.scss', (done) => {
    gulp.series(['styles'])(done);
  });
});