const { src, dest, watch, parallel, series }  = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
const ghPages = require('gulp-gh-pages');

const paths = {
  scripts: {
    src: 'app/js/main.js',  
    dest: 'app/js',
  },
  styles: {
    src: 'app/scss/style.scss',
    dest: 'app/css',
  },
  images: {
    src: 'app/images/**/*',
    dest: 'dist/images',
  },
  build: {
    src: ['app/css/style.min.css', 'app/fonts/**/*', 'app/js/main.min.js', 'app/*.html'],
    dest: 'dist',
  },
};

function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    }
  });
}

function cleanDist() {
  return del('dist');
}

function images() {
  return src(paths.images.src)
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(dest(paths.images.dest));
}

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/slick-carousel/slick/slick.js',
    'node_modules/wow.js/dist/wow.js',
    paths.scripts.src
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

function styles() {
  return src(paths.styles.src)
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 version'],
      grid: true
    }))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function build() {
  return src(paths.build.src, { base: 'app' })
    .pipe(dest(paths.build.dest));
}

function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/*.html']).on('change', browserSync.reload);
}

function deploy() {
  return src('dist/**/*')
    .pipe(ghPages());
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;
exports.build = series(cleanDist, images, build);
exports.deploy = deploy;
exports.default = parallel(styles, scripts, browsersync, watching);


