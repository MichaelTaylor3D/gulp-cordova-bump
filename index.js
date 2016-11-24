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

const vfs = require('vinyl-fs');
const args = require("yargs")['argv'];
const fs = require("fs");
const semver = require('semver');
const gutil = require('gutil');
const map = require('map-stream');
const through2 = require('through2');
const $ = require('gulp-load-plugins')();

/*
 * main functions -----------------------
 */

function Bump() {
   let self = {
      appendArgs: function (config) {
         // console.log("Data before args:");
         // console.log(config);
         let result = Object.assign({}, args);

         if (config) result = Object.assign(result, config);

         // if (!config.packageJson) config.packageJson = args.packageJson;
         // if (!config.bowerJson) config.bowerJson = args.bowerJson;
         // if (!config.configXml) config.configXml = args.configXml;
         // if (!config.patch) config.patch = args.patch;
         // if (!config.minor) config.minor = args.minor;
         // if (!config.major) config.major = args.major;
         // if (!config.setversion) config.setversion = args.setversion;
         // if (!config.autofiles) config.autofiles = args.autofiles;

         // console.log("Data after args:");
         // console.log(config);

         return result;
      },

      inc: function (version) {
         let pkg = this.getPackageJson();
         let oldVer = pkg.version;
         let newVer = semver.inc(oldVer, version);

         return this.set(newVer);
      },

      set: function (newVer) {
         this.pluginMessage();

         let jsonFilter = $.filter('**/*.json', {restore: true});
         let packageJsonFilter = $.filter('**/package*.json', {restore: true});
         let bowerJsonFilter = $.filter('**/bower*.json', {restore: true});
         let xmlFilter = $.filter('**/*.xml', {restore: true});

         let src = [];
         if (this.packageJson) {
            if (Array.isArray(this.packageJson)) src = [...src, ...this.packageJson];
            else
               src = [...src, this.packageJson];
         }

         if (this.bowerJson) {
            if (Array.isArray(this.bowerJson)) src = [...src, ...this.bowerJson];
            else
               src = [...src, this.bowerJson];
         }

         if (this.configXml) {
            if (Array.isArray(this.configXml)) src = [...src, ...this.configXml];
            else src = [...src, this.configXml];
         }

         //console.log(src);

         let log = function (name) {
            return function (data, cb) {
               console.log(name);
               console.log(data.base);
               cb(null, data);
            }
         };

         if (src.length)
            return vfs.src(src)
               .pipe(jsonFilter)
               .pipe($.bump({version: newVer}))
               .pipe(packageJsonFilter)
               //.pipe(map(log("package")))
               .pipe(vfs.dest((file) => {
                  return file.base;
               }))
               .pipe(packageJsonFilter.restore)
               .pipe(bowerJsonFilter)
               //.pipe(map(log("bower")))
               .pipe(vfs.dest((file) => {
                  return file.base;
               }))
               .pipe(bowerJsonFilter.restore)
               .pipe(jsonFilter.restore)
               .pipe(xmlFilter)
               .pipe($.xmlTransformer([
                  {path: '.', attr: {'version': newVer}}
               ]))
               .pipe(vfs.dest((file) => {
                  return file.base;
               }))
               .on('error', function (e) {
                  console.log(e);
               });
      },

      /*
       * helper s ----------------------- : function
       */

      getPackageJson: function () {
         return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      },

      pluginMessage: function () {
         gutil.log("\n\tRemember to run this before you run cordova build\n");
      }
   };

   return {
      run: function (input) {
         let data = self.appendArgs(input);

         if (data.packageJson) {
            self.packageJson = data.packageJson;
         } else if (data.autofiles && fs.existsSync('./package.json')) {
            self.packageJson = './package.json';
         }

         // console.log(self.packageJson);

         if (data.bowerJson) {
            self.bowerJson = data.bowerJson;
         } else if (data.autofiles && fs.existsSync('./bower.json')) {
            self.bowerJson = './bower.json';
         }

         if (data.configXml) {
            self.configXml = data.configXml;
         } else if (data.autofiles && fs.existsSync('./config.xml')) {
            self.configXml = './config.xml';
         }

         if (data.patch) {
            return self.inc('patch');
         } else if (data.minor) {
            return self.inc('minor');
         } else if (data.major) {
            return self.inc('major');
         } else if (data.setversion) {
            return self.set(data.setversion);
         } else {
            return this.help();
         }
      },

      help: function () {
         gutil.log('\n\tUSAGE:\n\t\t$ gulp bump --patch\n\t\t$ gulp bump --minor\n\t\t$ gulp bump --major\n\t\t$ gulp bump --setversion=2.1.0\n');
      }
   }
}

/*
 * module function -----------------------
 */
module.exports = new Bump();
