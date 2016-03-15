/**
 * Copy files and folders.
 *
 * ---------------------------------------------------------------
 *
 * # dev task config
 * Copies all directories and files, exept coffescript and less fiels, from the sails
 * assets folder into the .tmp/public directory.
 *
 * # build task config
 * Copies all directories nd files from the .tmp/public directory into a www directory.
 *
 * For usage docs see:
 *    https://github.com/gruntjs/grunt-contrib-copy
 */
module.exports = function(grunt) {

  grunt.config.set('copy', {
    dev: {
      files: [{
        expand: true,
        cwd: './assets',
        src: ['**/*.!(coffee|less)'],
        dest: '.tmp/public'
      }, {
        expand: true,
        cwd: './libs',
        src: ['angular-material/angular-material.css', 'angular-chart.js/dist/angular-chart.css'],
        flatten: true,
        dest: '.tmp/public/styles'
      }, {
        expand: true,
        cwd: './libs',
        src: ['jquery/dist/jquery.min.js','shaka-player/index.js', 'angular/angular.js', 'angular-ui-router/release/angular-ui-router.js',
        'angular-aria/angular-aria.js', 'angular-animate/angular-animate.js',
        'angular-material/angular-material.js', 'angular-messages/angular-messages.js',
        'clipboard/dist/clipboard.js', 'ngclipboard/dist/ngclipboard.js',
        'ng-file-upload/ng-file-upload-shim.min.js', 'ng-file-upload/ng-file-upload.min.js',
        'moment/moment.js', 'angular-moment/angular-moment.js',
        'Chart.js/Chart.js', 'angular-chart.js/dist/angular-chart.js'],
        flatten: true,
        dest: '.tmp/public/js/dependencies'
      }]
    },
    build: {
      files: [{
        expand: true,
        cwd: '.tmp/public',
        src: ['**/*'],
        dest: 'www'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
};
