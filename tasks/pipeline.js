/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */



// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
  'styles/angular-chart.css',
  'styles/angular-material.css',
  'styles/ngProgress.css',
  'styles/importer.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [
  // Load sails.io before everything else
  'js/dependencies/sails.io.js',
  'js/dependencies/jquery.min.js',
  'js/dependencies/angular.js',
  'js/dependencies/angular-ui-router.js',
  'js/dependencies/angular-material.js',
  'js/dependencies/angular-messages.js',
  'js/dependencies/angular-animate.js',
  'js/dependencies/angular-aria.js',
  'js/dependencies/ngprogress.js',
  'js/dependencies/clipboard.js',
  'js/dependencies/ngclipboard.js',
  'js/dependencies/ng-file-upload-shim.min.js',
  'js/dependencies/ng-file-upload.min.js',
  'js/dependencies/moment.js',
  'js/dependencies/angular-moment.js',
  'js/dependencies/Chart.js',
  'js/dependencies/angular-chart.js',
  'js/public/zoomableApp.js',
  'js/public/directives.js',
  'js/public/servicesAPI.js',
  'js/public/controllers/*.js',
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];



// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
  return 'assets/' + path;
});
