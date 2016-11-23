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
var filter = require('gulp-filter');
var bump = require('gulp-bump');
var xmlTransformer = require('gulp-xml-transformer');

/*
* main functions -----------------------
*/

function Bump() {

   return {
      run: function (input) {
         var data = this.appendArgs(input);

         if (data.packagejson) {
            this.packagejson = data.packagejson;
         } else if (data.autofiles && fs.existsSync('./package.json')) {
            this.packagejson = './package.json';
         }

         console.log(this.packagejson);
         console.log(that);

         if (data.bowerjson) {
            this.bowerjson = data.bowerjson;
         } else if (data.autofiles && fs.existsSync('./bower.json')) {
            this.bowerjson = './bower.json';
         }

         if (data.configxml) {
            this.configxml = data.configxml;
         } else if (data.autofiles && fs.existsSync('./config.xml')) {
            this.configxml = './config.xml';
         }

         if (data.patch) {
            return this.inc('patch');
         } else if (data.minor) {
            return this.inc('minor');
         } else if (data.major) {
            return this.inc('major');
         } else if (data.setversion) {
            return this.set(data.setversion);
         } else {
            return this.help();
         }
      },

      appendArgs: function (data) {
         // console.log("Data before args:");
         // console.log(data);
         if (!data) data = {}

         if (!data.packagejson) data.packagejson = args.packagejson;
         if (!data.bowerjson) data.bowerjson = args.bowerjson;
         if (!data.configxml) data.configxml = args.configxml;
         if (!data.patch) data.patch = args.patch;
         if (!data.minor) data.minor = args.minor;
         if (!data.major) data.major = args.major;
         if (!data.setversion) data.setversion = args.setversion;
         if (!data.autofiles) data.autofiles = args.autofiles;

         // console.log("Data after args:");
         // console.log(data);

         return data;
      },

      inc: function (version) {

         var pkg = this.getPackageJson();
         var oldVer = pkg.version;
         var newVer = semver.inc(oldVer, version);
         return this.set(newVer);
      },

      set: function (newVer) {

         this.pluginMessage();

         var jsonFilter = filter('**/*.json', { restore: true });
         var packageJsonFilter = filter('**/package*.json', { restore: true });
         var bowerJsonFilter = filter('**/bower*.json', { restore: true });
         var xmlFilter = filter('**/*.xml', { restore: true });

         var src = [];
         if (this.packagejson) {
            if (this.packagejson.lenth) src = [...src, ...this.packagejson]
            else src = [...src, this.packagejson];
         }

         if (this.bowerjson) {
            if (this.bowerjson.lenth) src = [...src, ...this.bowerjson]
            else src = [...src, this.bowerjson];
         }

         if (this.configxml) {
            if (this.configxml.lenth) src = [...src, ...this.configxml]
            else src = [...src, this.configxml];
         }

         // console.log(src);

         if (src.length)
            return vfs.src(src)
               .pipe(jsonFilter)
               .pipe(bump({ version: newVer }))
               .pipe(packageJsonFilter)
               .pipe(vfs.dest(this.getFolderPath(this.packagejson)))
               .pipe(packageJsonFilter.restore)
               .pipe(bowerJsonFilter)
               .pipe(vfs.dest(this.getFolderPath(this.bowerjson)))
               .pipe(bowerJsonFilter.restore)
               .pipe(jsonFilter.restore)
               .pipe(xmlFilter)
               .pipe(xmlTransformer([
                  { path: '.', attr: { 'version': newVer } }
               ]))
               .pipe(vfs.dest(this.getFolderPath(this.configxml)));
      },

      /*
      * helper functions -----------------------
      */

      getPackageJson: function () {
         return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      },

      pluginMessage: function () {
         gutil.log("\n\tRemember to run this before you run cordova build\n");
      },

      getFolderPath: function (path) {
         return path ? path.substr(0, path.lastIndexOf('/') + 1) : ".";
      },

      help: function () {
         gutil.log('\n\tUSAGE:\n\t\t$ gulp bump --patch\n\t\t$ gulp bump --minor\n\t\t$ gulp bump --major\n\t\t$ gulp bump --setversion=2.1.0\n');
      },

   }
}
/*
* module function -----------------------
*/

module.exports = Bump;
