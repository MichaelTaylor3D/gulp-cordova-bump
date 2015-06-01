> Bump your Cordova package version

Run this before you run cordova build

This bumps and syncs config.xml, package.json and bower.json semantic versions

## Install

```sh
$ npm install --save-dev gulp-cordova-bump
```

## Add the following to your gulpfile

```js
gulp.task('bump', require('gulp-cordova-bump'));
```
## Usage
```sh
$ gulp bump --patch
$ gulp bump --minor
$ gulp bump --major
$ gulp bump --setversion=2.1.0
```

## Build script support (Experimental)
```sh
var bump = require('gulp-cordova-bump');
bump('patch');
bump('minor');
bump('major');
```


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
