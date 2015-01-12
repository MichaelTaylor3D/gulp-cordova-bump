/*
* Author: Michael Taylor
* www.michaeltaylor3d.com
* 
* usage: 
* put 
*    gulp.task('bump', require('gulp-cordova-bump')());
* into your gulpfile
*/

'use strict';

var vfs = require('vinyl-fs');
var args = require("yargs").argv;
var fs = require("fs");
var semver = require('semver');
var gutil = require('gutil');
var $ = require('gulp-load-plugins')();

/*
* module function -----------------------
*/

module.exports = function() {
  
    if (args.patch) {
      bumpver('patch');
    } else if (args.minor) {
      bumpver('minor');
    } else if (args.major) {
      bumpver('major');
    } else if (args.setversion) {
      setver(args.setversion);
    } else {
      help();
    }
}

/*
* main functions -----------------------
*/

function bumpver(version) {  
  
  var pkg = getPackageJson();
  var oldVer = pkg.version;
  var newVer = semver.inc(oldVer, version);
  setver(newVer);
}

function setver(newVer) {

  pluginMessage();

  var jsonFilter = $.filter('**/*.json');
  var xmlFilter = $.filter('**/*.xml');

  return vfs.src(['./package.json', './bower.json', './config.xml'])
    .pipe(jsonFilter)
    .pipe($.bump({version: newVer}))
    .pipe(vfs.dest('./'))
    .pipe(jsonFilter.restore())
    .pipe(xmlFilter)
    .pipe($.xmlEditor([
        { path: '.', attr: { 'version': newVer } } 
    ]))
  .pipe(vfs.dest("./"));
}

/*
* helper functions -----------------------
*/

var getPackageJson = function () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

function help() {
  gutil.log('\n\tUSAGE:\n\t\t$ gulp bump --patch\n\t\t$ gulp bump --minor\n\t\t$ gulp bump --major\n\t\t$ gulp bump --setversion=2.1.0\n');
}

function pluginMessage() {
  gutil.log("\n\tRemember to run this before you run cordova build\n");
}
