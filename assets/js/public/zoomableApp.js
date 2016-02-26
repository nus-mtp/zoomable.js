angular.module('zoomableApp', ['ui.router', 'ngMaterial', 'ngMessages', 'ngclipboard'])
// Define standard theme for dashboard UI
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('cyan', {
      'default': '700' // use shade 700 for default, and keep all other shades the same
    })
    .accentPalette('red');
});
