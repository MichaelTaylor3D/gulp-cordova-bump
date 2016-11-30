/*
 * Author: Michael Taylor
 * www.michaeltaylor3d.com
 *
 * usage:
 * put
 *    gulp.task('bump', require('gulp-cordova-bump'));
 * into your gulpfile
 *
 * modified by laser
 */

'use strict';

const vfs = require('vinyl-fs');
const args = require("yargs")['argv'];
const fs = require("fs");
const semver = require('semver');
const chalk = require('chalk');
const map = require('map-stream');
const _ = require('lodash');
const through2 = require('through2');
const $ = require('gulp-load-plugins')();

/*
 * main functions -----------------------
 */

function Bump() {
   let self = {
      appendArgs: function (config) {
         let result = _.pick(args, ['minor', 'major', 'patch', 'setversion']);

         result['packageJson'] = args['packagejson'];
         result['bowerJson'] = args['bowerjson'];
         result['configXml'] = args['configxml'];

         if (config) result = Object.assign(result, config);

         // on collision the higher one wins
         if (result.setversion) {
            result.bumpType = '';
            result.singleVersion = true;
         } else if (result.major) {
            result.bumpType = 'major';
         } else if (result.minor) {
            result.bumpType = 'minor';
         } else if (result.patch) {
            result.bumpType = 'patch';
         }

         return result;
      },

      set: function (config) {
         let newVer = null;
         if (config.singleVersion && config.setversion) {
            config.version = config.setversion;
         }

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

         let xmlVersion = null;
         let xmlAttrs = [{
            'version': val => {
               console.log(chalk.green('Old file version: ') + chalk.yellow(val));
               if (config.singleVersion) {
                  xmlVersion = config.version;
               }
               else {
                  xmlVersion = semver.inc(val, config.bumpType);
               }
               console.log(chalk.green('New file version: ') + chalk.yellow(xmlVersion));
               return xmlVersion;
            }
         }];

         if (_.isFunction(config.setAndroidXmlCode)) {
            xmlAttrs.push({
               'android-versionCode': val => {
                  console.log(chalk.green('Old android version code: ') + chalk.yellow(val));
                  let newVal = config.setAndroidXmlCode(xmlVersion);
                  console.log(chalk.green('New android version code: ') + chalk.yellow(newVal));

                  return newVal;
               }
            })
         }

         if (src.length) {
            let stream = vfs.src(src)
               .pipe(through2.obj((file, enc, cb) => {
                  console.log(chalk.white("##########################################################################"));
                  console.log(chalk.green('Bumping file: ') + chalk.yellow(file.path));
                  cb(null, file);
               }))
               .pipe(jsonFilter)
               .pipe(through2.obj((file, enc, cb) => {
                  let oldVer = require(file.path).version;
                  console.log(chalk.green('Old file version: ') + chalk.yellow(oldVer));

                  if (!config.version || !config.singleVersion) {
                     // TODO: at least one .json file needs a version in case of single version, single xml is not enough
                     config.version = semver.inc(oldVer, config.bumpType);
                  }
                  console.log(chalk.green('New file version: ') + chalk.yellow(config.version));
                  cb(null, file);
               }))
               .pipe($.bump(config))
               .pipe(packageJsonFilter)
               .pipe(vfs.dest((file) => {
                  return file.base;
               }))
               .pipe(packageJsonFilter.restore)
               .pipe(bowerJsonFilter)
               .pipe(vfs.dest((file) => {
                  return file.base;
               }))
               .pipe(bowerJsonFilter.restore)
               .pipe(jsonFilter.restore)
               .pipe(xmlFilter)
               .pipe($.xmlTransformer([{
                  path: '.', attrs: xmlAttrs
               }]))
               .pipe(vfs.dest((file) => {
                  return file.base;
               }));

            stream.on('error', (e) => {
               console.log(chalk.red(e));
            });
            stream.on('end', () => {
               console.log(chalk.white("##########################################################################"));

               this.pluginMessage();
            });

            return stream;
         }
      },

      /*
       * helper s ----------------------- : function
       */

      pluginMessage: function () {
         console.log("\n\tRemember to run this before you run cordova build\n");
      }
   };

   return {
      run: function (input) {
         let config = self.appendArgs(input);

         if (!config.hasOwnProperty('bumpType'))
            return this.help();

         if (config.packageJson) {
            self.packageJson = config.packageJson;
         } else if (config.autofiles && fs.existsSync('./package.json')) {
            self.packageJson = './package.json';
         }

         if (config.bowerJson) {
            self.bowerJson = config.bowerJson;
         } else if (config.autofiles && fs.existsSync('./bower.json')) {
            self.bowerJson = './bower.json';
         }

         if (config.configXml) {
            self.configXml = config.configXml;
         } else if (config.autofiles && fs.existsSync('./config.xml')) {
            self.configXml = './config.xml';
         }

         return self.set(config);
      },

      help: function () {
         console.log('\n\tUSAGE:\n\t\t$ gulp bump --patch\n\t\t$ gulp bump --minor\n\t\t$ gulp bump --major\n\t\t$ gulp bump --setversion=2.1.0\n');
      }
   }
}

/*
 * module function -----------------------
 */
module.exports = new Bump();
