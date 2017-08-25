var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var newer = require('gulp-newer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var twig = require('gulp-twig');
var prettify = require('gulp-html-prettify');
var imagemin = require('gulp-imagemin');
var svgSprite = require('gulp-svg-sprite');
var connect = require('gulp-connect');
var livereload = require('gulp-livereload');
var clean = require('gulp-clean');

// Build
gulp.task('build', ['css', 'js', 'templates', 'icons', 'images']);

// Build and run a server
gulp.task('default', ['build', 'connect', 'watch']);

// Process and compress Sass files
gulp.task('css', function() {
  gulp.src('src/css/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed', precision: 8}).on('error', sass.logError))
    .pipe(autoprefixer('ie 10', 'last 2 versions'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload());
});

// Compress and combine JS
gulp.task('js', function() {
  gulp.src('src/js/*.js')
    .pipe(newer('dist/js'))
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest('dist/js'))
    .pipe(livereload());

  gulp.src('src/js/vendor/*.js')
    .pipe(newer('dist/js'))
    .pipe(uglify())
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(livereload());
});

// Generate complete set of templates from Twig files
gulp.task('templates', function () {
  gulp.src('src/*.html')
    .pipe(twig())
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
});

// Create icon sprite
gulp.task('icons', function () {
  return gulp.src('src/images/icons/*.svg')
    .pipe(svgSprite({
      mode: {
        defs: {
          dest: '.',
          sprite: 'icons-sprite.svg'
        }
      }
    }))
    .pipe(gulp.dest('dist/images'))
    .pipe(livereload());
});

// Process and compress images
gulp.task('images', function () {

  // Compress JPG and PNG
  gulp.src(['src/images/**/*.{jpg,png}', '!src/images/icons/*.svg'])
    .pipe(newer('dist/images'))
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
    .pipe(livereload());

  // Move icons, SVGs and precompressed files
  gulp.src(['src/images/*.ico', 'src/images/**/*.svg', '!src/images/icons/*.svg'])
    .pipe(newer('dist/images'))
    .pipe(gulp.dest('dist/images'))
    .pipe(livereload());
});

// Run a local server
gulp.task('connect', function() {
  connect.server({
    root: 'dist'
  });
});

// Watch for changes and reload the page
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('src/css/**/*.scss', ['css']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/**/*.html', ['templates']);
  gulp.watch('src/images/icons/*.svg', ['icons']);
  gulp.watch(['src/images/**/*.svg','src/images/**/*.jpg','src/images/**/*.png', 'src/images/**/*.ico', '!src/images/icons/*.svg'], ['images'])
});

// Remove the dist folder
gulp.task('clean', function () {
  gulp.src('dist', {read: false})
    .pipe(clean());
});
