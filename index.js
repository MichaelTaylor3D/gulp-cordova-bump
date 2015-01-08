'use strict';

var gulp = require('gulp');
var fontgen = require('gulp-fontgen');
var svgSprite = require('gulp-svg-sprites');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var autoprefixer = require('gulp-autoprefixer');
var bump = require('gulp-cordova-bump');

var paths = {
    sass: ['./scss/**/*.scss'],
    fonts: ['./www/fonts/*.ttf'],
    icons: ['./www/icons/*.svg']
};

gulp.task("bump", function(params)
{
    if (gulp.env.patch) {
        bump('patch');
    } else if (gulp.env.minor) {
        bump('minor');
    } else if (gulp.env.major) {
        bump('major');
    }
})

gulp.task('default', ['sass', /*'fonts',*/ 'icons']);

gulp.task('sass', function (done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('fonts', function (done) {
    gulp.src('./www/fonts/*.ttf')
        .pipe(fontgen({
            dest: './www/build/fonts',
            'css_fontpath': '../build/fonts/',
            collate: true
        }, done));

    gulp.src('./www/build/fonts/**/*.css')
        .pipe(concat('webfonts.css'))
        .pipe(gulp.dest('./www/css/'));
});

gulp.task('icons', function () {
    return gulp.src('./www/icons/*.svg')
        .pipe(svgSprite({
            mode: 'symbols'
        }))
        .pipe(gulp.dest('./www/build/'));
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    //gulp.watch(paths.fonts, ['fonts']);
    gulp.watch(paths.icons, ['icons']);
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
