var gulp = require('gulp'),
    bump = require('gulp-bump'),
    gutil = require('gulp-util'),
    semver = require('semver'),
    filter = require('gulp-filter'),
    xeditor = require("gulp-xml-editor"),
    fs = require('fs'),
    argv = require('yargs').argv;;

var getPackageJson = function () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

function bumpver(version) {
  
  gutil.log("Remember to run this before you run cordova build");
  
  var pkg = getPackageJson();
  var oldVer = pkg.version;
  var newVer = semver.inc(oldVer, version);
  setver(newVer);
}

function setver(newVer) {

  var jsonFilter = filter('**/*.json');
  var xmlFilter = filter('**/*.xml');

  return gulp.src(['./package.json', './bower.json', './config.xml'])
    .pipe(jsonFilter)
    .pipe(bump({version: newVer}))
    .pipe(gulp.dest('./'))
    .pipe(jsonFilter.restore())
    .pipe(xmlFilter)
    .pipe(xeditor([
        { path: '.', attr: { 'version': newVer } } 
    ]))
  .pipe(gulp.dest("./"));
}

module.exports = function() {
    if (argv.patch) {
      return bumpver('patch');
    } else if (argv.minor) {
        return bumpver('minor');
    } else if (argv.major) {
        return bumpver('major');
    } else if (argv.setversion) {
        return setver(argv.setverion);
    }
}

