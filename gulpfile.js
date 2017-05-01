/*
Author: Serge Harb
Gulpfile.js file:

Steps:

1. Install gulp globally:
npm install --global gulp
and use 'npm init' command to create package.json file

2. Type the following after navigating in your project folder:
npm install gulp gulp-util gulp-sass gulp-uglify gulp-rename gulp-autoprefixer gulp-imagemin gulp-cache gulp-clean-css gulp-notify gulp-concat gulp-plumber browser-sync del --save-dev

3. To install foundation:
npm install foundation-sites --save

4. Move this file in your project folder

5. Setup your vhosts or just use static server (see 'Prepare Browser-sync for localhost' below)

6. Type 'Gulp' and start developing, enjoy!
*/

/* Needed gulp config */
var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-clean-css');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var del = require('del');
var reload = browserSync.reload;

/* Vendor Scripts task */
gulp.task('vendor-scripts', function () {
  return gulp.src([
      /* Add your Vendor scripts here, they will be combined in this order */
      'node_modules/socket.io-client/dist/socket.io.js',
      'public/dev/scripts/main/jquery.js',
      'public/dev/scripts/main/materialize.js',
      'public/dev/scripts/main/angular.js',
      'public/dev/scripts/main/angular-route.js',
      'public/dev/scripts/main/angular-sanitize.js',
      'public/dev/scripts/main/ngStorage.js'
    ])
    .pipe(concat({ path: 'vendor.js' }))
    .pipe(gulp.dest('public/dist/scripts'))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist/scripts'));
});

/* AppScripts JavaScript task */
gulp.task('appscripts', function () {
  return gulp.src([
      /* Add your JS files here, they will be combined in this order */
      'public/dev/scripts/directives/*.js',
      'public/dev/scripts/app.js',
      'public/dev/scripts/services/*.js',
      'public/views/**/*.js'
    ])
    .pipe(concat({ path: 'app.js' }))
    .pipe(gulp.dest('public/dist/scripts'))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist/scripts'))
    .pipe(reload({ stream: true }));
});

/* Sass task */
gulp.task('sass', function () {
  gulp.src('public/dev/scss/main.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({ browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3'] }))
    .pipe(gulp.dest('public/dist/css'))
    .pipe(minifycss())
    .pipe(gulp.dest('public/dist/css'))
    /* Reload the browser CSS after every change */
    .pipe(reload({ stream: true }));
});

/* Images task */
gulp.task('images', function () {
  return gulp.src([
      'public/dev/images/*.png',
      'public/dev/images/*.jpg',
      'public/dev/images/*.svg'
    ])
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('public/dist/images'));
});

/* Clean task */
gulp.task('clean', function () {
  return del(['public/dist/css', 'public/dist/scripts', 'public/dist/images']);
});

/* Reload task */
gulp.task('bs-reload', function () {
  browserSync.reload();
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', function () {
  browserSync.init(['public/dist/css/*.css', 'public/dist/scripts/*.js'], {
    proxy: 'http://localhost:12345',
    port: 8888,
    /* For a static server you would use this: */
    // server: {
    //     baseDir: './'
    // },

    open: true,
    notify: false
  });
});

/* Watch scss, ts, js, php, html files, doing different things with each. */
gulp.task('default', ['clean', 'sass', 'vendor-scripts', 'appscripts', 'images', 'browser-sync'], function () {
  /* Watch scss, run the sass task on change. */
  gulp.watch(['public/dev/scss/*.scss', 'public/dev/scss/**/*.scss'], ['sass']);
  /* Watch vendor js files, run the vendor scripts task on change. */
  gulp.watch(['public/dev/scripts/main/*.js'], ['vendor-scripts']);
  /* Watch appscripts js files, run the appscripts js scripts task on change. */
  gulp.watch(['public/views/**/*.js', 'public/dev/scripts/**/*.js', 'public/dev/scripts/app.js'], ['appscripts']);
  /* Watch images, run the images task on change. */
  gulp.watch(['public/dev/images/*.*'], ['images']);
  /* Watch .html and .php files, run the bs-reload task on change. */
  gulp.watch(['public/views/**/*.html', 'public/*.html'], ['bs-reload']);
});