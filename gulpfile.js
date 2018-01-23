'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const server = require('browser-sync').create();
const webpack = require('gulp-webpack');
const del = require('del');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const htmlhint = require('gulp-htmlhint');

// 1. Задача для сборки build/style.css из sass-файлов, которые подключены в т.н. "диспетчере подключений" style.scss директивой @import,

gulp.task('style', function () {
  gulp.src('src/sass/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        browsers: [
          'last 1 version',
          'last 2 Chrome versions',
          'last 2 Firefox versions',
          'last 2 Opera versions',
          'last 2 Edge versions'
        ]
      }),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(rename('style/style.css'))
    .pipe(gulp.dest('build/'))
    .pipe(server.stream());
});

// 2. Копирование html-файлов из ./scr в ./build

gulp.task('html', ['init'], function () {
  gulp.src('src/**/*.html')
    .pipe(server.stream());
});

// 3. Запуск WEB-сервера

gulp.task('server', [/* 'html', */'style', 'script'], function () {
  server.init({
    server: './build',
    port: 3502
  });

  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/sass/**/*.scss', ['style']);
  gulp.watch('src/js/**/*.js', ['script']);
});

// 4. Копирование, сборка и транспайлинг ES6-кода


gulp.task('script', function () {
  gulp.src('src/js/main.js')
    .pipe(plumber())
    .pipe(webpack({
      devtool: 'sourcemap',
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader'
          }
        ]
      },
      output: {
        filename: 'script.js'
      }
    })
  )
  .pipe(gulp.dest('./build/js/'))
  .pipe(server.stream());
});

gulp.task('clear', () => del('./build'));

// 5. Упорядочивание задач для перезапуска сервера "на лету"

// Копирование КОНТЕНТА(html + избражения) и ВНЕШНИХ БИБЛИОТЕК из ./scr в ./build на старте

gulp.task('init', function () {
  gulp.src('src/**/*.{html,png,jpg,gif,ico,txt,xml}')
    .pipe(gulp.dest('build/'));
  gulp.src('src/js-external/**/*.js')
    .pipe(gulp.dest('build/js/'));
  gulp.src('src/fonts/**/*.woff')
    .pipe(gulp.dest('build/fonts/'));
});

gulp.task('htmllint', function () {

  gulp.src('./src/*.html')
      .pipe(htmlhint('.htmlhintrc'))
      .pipe(htmlhint.reporter());
});
