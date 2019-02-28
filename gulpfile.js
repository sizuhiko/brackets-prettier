'use strict';

const gulp = require('gulp'); // eslint-disable-line node/no-unpublished-require
const install = require('gulp-install'); // eslint-disable-line node/no-unpublished-require

gulp.task('install', () => {
  return gulp.src(['./package.json']).pipe(
    install({
      npm: '--production',
    })
  );
});

gulp.task('update3rd', gulp.series('install'), () => {
  return gulp
    .src(['./node_modules/prettier/standalone.js', './node_modules/prettier/parser-*.js'])
    .pipe(gulp.dest('thirdparty'));
});
