> Bump your Cordova package version

Run this before you run cordova build

This bumps and syncs config.xml, package.json and bower.json semantic versions

## Install

```sh
$ npm install --save-dev gulp-cordova-bump
```

## Add the following to your gulpfile

```js
var bump = require('gulp-cordova-bump');
var argv = require('yargs').argv;

gulp.task("bump", function(params)
{
    if (argv.patch) {
        bump.ver('patch');
    } else if (argv.minor) {
        bump.ver('minor');
    } else if (argv.major) {
        bump.ver('major');
    } else if (argv.setversion) {
        bump.set(argv.setverion);
    }
})
```
## Usage
```sh
$ gulp bump --patch
$ gulp bump --minor
$ gulp bump --major
$ gulp bump --setversion=2.1.0
```


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
