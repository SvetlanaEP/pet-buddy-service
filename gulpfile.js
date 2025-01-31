const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass")(require('sass'));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();

const csso = require('postcss-csso');
const rename = require('gulp-rename');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore')
const del = require("del");

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
     ]))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(gulp.dest('build'))
}

exports.html = html

// Scripts

const script = () => {
  return gulp.src('source/js/app.js')
    .pipe(terser())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('build/js'))
}

exports.script = script

// Images

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png,svg}')
    .pipe(imagemin())
    .pipe(gulp.dest('build/img'))
}

exports.optimizeImages = optimizeImages

const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png,svg,webp}',)
    .pipe(gulp.dest('build/img'))
}

exports.copyImages = copyImages

// Webp

const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest('build/img'))
}

exports.createWebp = createWebp

// Sprite

const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'))
}
exports.sprite = sprite

// Copy

const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
    'source/img/**/*.svg',
    '!source/img/icons/*.svg'
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done()
}

exports.copy = copy

// Clean

const clean = () => {
  return del('build')
}

exports.clean = clean

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload()
  done()
}

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/js/script.js", gulp.series(script));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

// Build

const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    script,
    sprite,
    createWebp
  )
)

exports.build = build

// Default

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    script,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);
