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

Bump.prototype.run = function() {
  if (args.packagejson){
    this.packagejson = args.packagejson;
  } else {
    this.packagejson = './package.json';
  }
  
  if (args.bowerjson){
    this.bowerjson = args.bowerjson;
  } else {
    this.bowerjson = './bower.json';
  }
  
  if (args.configxml){
    this.configxml = args.configxml;
  } else {
    this.configxml = './config.xml';
  }
  
  if (args.patch) {
    return this.inc('patch');
  } else if (args.minor) {
    return this.inc('minor');
  } else if (args.major) {
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
  var packageJsonFilter = $.filter('**/package.json');
  var bowerJsonFilter = $.filter('**/bower.json');
  var xmlFilter = $.filter('**/*.xml');

  return vfs.src([this.packagejson, this.bowerjson, this.configxml])
    .pipe(jsonFilter) 
    .pipe($.bump({version: newVer}))
    .pipe(packageJsonFilter)
    .pipe(vfs.dest(this.getFolderPath(this.packagejson)))
    .pipe(packageJsonFilter.restore())
    .pipe(bowerJsonFilter)
    .pipe(vfs.dest(this.getFolderPath(this.bowerjson)))
    .pipe(bowerJsonFilter.restore())
    .pipe(jsonFilter.restore())
    .pipe(xmlFilter)
    .pipe($.xmlEditor([
        { path: '.', attr: { 'version': newVer } }
    ]))
  .pipe(vfs.dest(this.getFolderPath(this.configxml)));
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

Bump.prototype.getFolderPath = function(path) {
  return path.substr(0,path.lastIndexOf('/') + 1);
}

Bump.prototype.help = function() {
  gutil.log('\n\tUSAGE:\n\t\t$ gulp bump --patch\n\t\t$ gulp bump --minor\n\t\t$ gulp bump --major\n\t\t$ gulp bump --setversion=2.1.0\n');
}

/*
* module function -----------------------
*/

var init = new Bump();
module.exports = function () { return init.run(); };
