// Karma configuration
// Generated on Mon Feb 29 2016 11:42:08 GMT+0800 (SGT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'libs/angular/angular.js',
      'libs/angular-animate/angular-animate.js',
      'libs/angular-aria/angular-aria.js',
      'libs/angular-material/angular-material.js',
      'libs/angular-messages/angular-messages.js',
      'libs/angular-ui-router/release/angular-ui-router.js',
      'libs/angular-mocks/angular-mocks.js',
      'libs/angular-material/angular-material-mocks.js',
      'libs/clipboard/dist/clipboard.js',
      'libs/ngclipboard/dist/ngclipboard.js',
      'libs/ng-file-upload/ng-file-upload-shim.min.js',
      'libs/ng-file-upload/ng-file-upload.min.js',
      'libs/moment/moment.js',
      'libs/angular-moment/angular-moment.js',
      'libs/Chart.js/Chart.js',
      'libs/angular-chart.js/dist/angular-chart.js',
      'libs/ngprogress/build/ngprogress.js',

      'assets/js/public/zoomableApp.js',
      'assets/js/public/directives.js',
      'assets/js/public/servicesAPI.js',
      'assets/js/public/controllers/*.js',

      'test/frontend/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'assets/js/public/**/*.js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage'],


    coverageReporter: {
      type : 'lcov',
      dir : 'coverage/',
      subdir: 'client'
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],
    //browsers: ['PhantomJS', 'Chrome', 'Safari', 'Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
