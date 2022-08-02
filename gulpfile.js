const childProcess = require('child_process');

const gulp = require('gulp');
const liveReload = require('gulp-livereload');
const gulpClean = require('gulp-clean');
const dartSass = require('sass');
const gulpSass = require('gulp-sass');
const gulpLiveServer = require('gulp-live-server');
const { parallel } = require('gulp');
const sass = gulpSass(dartSass);

const styleGlob = './styles/**/*.scss';
const htmlGlob = '*.html';
const distPath = './dist';

function clean() {
    return gulp.src(`${distPath}/*`, {read: false}).pipe(gulpClean());
}

function scssCompile() {
    return gulp.src(styleGlob)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(distPath))
    .pipe(liveReload());
}

function moveHtml() {
    return gulp.src(htmlGlob)
    .pipe(gulp.dest(distPath))
}

function serve(cb) {
    var server = gulpLiveServer.static(distPath, 3000);
    server.start();

    gulp.watch(['./dist/**/*'], (file) => {
        server.notify.apply(server, [file]);
    });
}

function watch() {
    gulp.watch(styleGlob, scssCompile);
    gulp.watch(htmlGlob, moveHtml);
}

exports.default = gulp.series(
    clean,
    parallel(moveHtml, scssCompile),
    parallel(serve, watch),
)