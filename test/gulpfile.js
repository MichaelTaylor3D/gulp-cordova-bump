var gulp = require('gulp'),
   bump = require('../index.js'),
   _ = require('lodash');

gulp.task('help', bump.help.bind(bump));

gulp.task('help2', function () {
   bump.help();
});

// Old school bumping is still working:
gulp.task('bump', function () {
   bump.run({autofiles: true});
});

gulp.task('test1', function () {
   bump.run({packageJson: 'package1.json', minor: true});
});

gulp.task('test2', function () {
   bump.run({packageJson: ['subdir/package1.json'], configXml: ['subdir/config2.xml'], major: true});
});

gulp.task('test3', function () {
   bump.run({
      packageJson: ['package1.json', 'subdir/package1.json'],
      configXml  : ['./config.xml', 'subdir/config2.xml'],
      patch      : true
   });
});

gulp.task('tests', function () {
   bump.run({
      packageJson  : ['package1.json', 'subdir/package1.json'],
      configXml    : ['./config.xml', 'subdir/config2.xml'],
      patch        : true,
      singleVersion: true
   });
});


gulp.task('testf', function () {
   var setAndroidXmlCode = function (version) {
      var code = 0;
      _.split(version, '.').forEach(function (val) {
         code = code * 100 + Number(val);
      });

      return code * 10;
   };

   bump.run({
      configXml        : ['./config2.xml'],
      patch            : true,
      setAndroidXmlCode: setAndroidXmlCode
   });
});


gulp.task('restore', function () {
   var setAndroidXmlCode = function (version) {
      var code = 0;
      _.split(version, '.').forEach(function (val) {
         code = code * 100 + Number(val);
      });

      return code * 10;
   };

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

   bump.run({
      configXml  : ['./config2.xml'],
      setversion : "1.0.0",
      setAndroidXmlCode: setAndroidXmlCode
   });
});
