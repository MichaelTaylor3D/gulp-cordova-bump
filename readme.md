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

## Advanced usage
```
var bump = require('gulp-cordova-bump');

gulp.task('minorBump', function () {
   bump.run({packageJson: 'subdir/package1.json', minor: true});
});
```

## Tests
More sophisticated examples are in test/gulpfile.js
`gulp restore` will restore the tests to original state

## Parameters
Now this package supports multiple files in different directories. 
* `packageJson`: Array of strings, or a String
* `bowerJson`: Array of strings, or a String
* `configXml`: Array of strings, or a String
* `singleVersion`: Boolean, the first file in the list defines version which will be used for all others.
* `autofiles`: Boolean, tries to find package.json, bower.json and config.xml locally
* `setAndroidXmlCode`: Function that converts semver string to Number, for config.xml attribute android-versionCode. It is needed if you want to define own version numbers in Android app.

## Notes
This tool accept both command line parameters and config parameters in gulp, can be mixed
If patch types are mixed, the priority of bumping: 
>setversion > major > minor > patch

> Using spread operator and some other ES6 features that are now supported by Node.js:
http://node.green/#spread-------operator

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
