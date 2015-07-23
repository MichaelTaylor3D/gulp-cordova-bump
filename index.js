/*
* Author: Michael Taylor
* www.michaeltaylor3d.com
*
* usage:
* put
*    gulp.task('bump', require('gulp-cordova-bump'));
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
* main functions -----------------------
*/

function Bump() {}

Bump.prototype.run = function(version) {

  if (args.patch || version == 'patch') {
    return this.inc('patch');
  } else if (args.minor  || version == 'minor') {
    return this.inc('minor');
  } else if (args.major  || version == 'major') {
    return this.inc('major');
  } else if (args.setversion) {
    return this.set(args.setversion);
  } else {
    return this.help();
  }
}

Bump.prototype.inc = function(version) {

  var pkg = this.getPackageJson();
  var oldVer = pkg.version;
  var newVer = semver.inc(oldVer, version);
  return this.set(newVer);
}

Bump.prototype.set = function(newVer) {

  this.pluginMessage();

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

Bump.prototype.getPackageJson = function () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

Bump.prototype.pluginMessage = function() {
  gutil.log("\n\tRemember to run this before you run cordova build\n");
}

Bump.prototype.help = function() {
  gutil.log('\n\tUSAGE:\n\t\t$ gulp bump --patch\n\t\t$ gulp bump --minor\n\t\t$ gulp bump --major\n\t\t$ gulp bump --setversion=2.1.0\n');
}

/*
* module function -----------------------
*/

var init = new Bump();
module.exports = function (version) { return init.run(version); };
