var gulp = require('gulp'),
   bump = require('../index.js');

gulp.task('help', bump.help.bind(bump));

gulp.task('help2', function () {
   bump.help();
});

// Old school bumping is still working:
gulp.task('old', function () {
   bump.run({autofiles: true});
});

gulp.task('test1', function () {
   bump.run({packageJson: 'package1.json', minor: true});
});

gulp.task('restore', function () {
   bump.run({
      packageJson: ['./package.json',
         './package1.json',
         './package2.json',
         'subdir/package1.json',
         'subdir/package2.json',
         'subdir/package3.json'],
      configXml  : ['./config.xml', 'subdir/config2.xml'],
      setversion : "1.0.0"
   });
});
