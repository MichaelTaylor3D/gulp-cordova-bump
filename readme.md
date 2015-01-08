> Bump your Cordova package version

Run this before you run cordova build

## Install

```sh
$ npm install --save-dev gulp-cordova-bump
```

## Add the following to your gulpfile

```js
var bump = require('gulp-cordova-bump');

gulp.task("bump", function(params)
{
    if (gulp.env.patch) {
        bump('patch');
    } else if (gulp.env.minor) {
        bump('minor');
    } else if (gulp.env.major) {
        bump('major');
    }
}
```
## Usage
```sh
$ gulp bump --patch
$ gulp bump --minor
$ gulp bump --major
```


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
