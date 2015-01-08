
var gulp = require('gulp'),
    bump = require('gulp-bump'),
    gutil = require('gulp-util'),
    q = require('q'),
    semver = require('semver'),
    filter = require('gulp-filter'),
    xeditor = require("gulp-xml-editor"),
    fs = require('fs');

var getPackageJson = function () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

function bumpver(version) {
  gutil.log("Remember to run this before you run cordova build");
  var deferred = Q.defer();
  var pkg = getPackageJson();
  var oldVer = pkg.version;
  var newVer = semver.inc(oldVer, version);
  var jsonFilter = filter('**/*.json');
  var xmlFilter = filter('**/*.xml');

  gulp.src(['./package.json', './bower.json', './config.xml'])
    .pipe(jsonFilter)
    .pipe(bump({version: newVer}))
    .pipe(gulp.dest('./'))
    .pipe(jsonFilter.restore())
    .pipe(xmlFilter)
    .pipe(xeditor([
        {path: '.', attr: { 'version': newVer } } 
    ]))
  .pipe(gulp.dest("./dest"));

  return deferred.promise;
}