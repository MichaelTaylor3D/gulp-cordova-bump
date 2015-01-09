
var gulp = require('gulp'),
    bump = require('gulp-cordova-bump'),
    argv = require('yargs').argv;

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
}