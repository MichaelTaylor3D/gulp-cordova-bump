> Bump your Cordova package version

Run this before you run cordova build

This bumps and syncs config.xml, package.json and bower.json semantic versions

## Install

```sh
$ npm install --save-dev gulp-cordova-bump
```

## Add the following to your gulpfile

```js
gulp.task('bump', function () {
   require('gulp-cordova-bump').run({autofiles: true});
});
```
## Usage
```sh
$ gulp bump --patch
$ gulp bump --minor
$ gulp bump --major
$ gulp bump --setversion=2.1.0
```
You can also specify the location of `package.json`, `bower.json` and `config.xml` by using the following args:
```sh
$ gulp bump --patch --packagejson=<package_json_file_path>
$ gulp bump --minor --bowerjson=<bower_json_file_path>
$ gulp bump --major --configxml=<config_xml_file_path>

e.g.

$ gulp bump --setversion=2.1.0 --packagejson="./package.json" --bowerjson="./bower.json" --configxml="./config.xml"
```

## Using spread operator and some other ES6 features that are now supported by Node.js:
http://node.green/#spread-------operator

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
