angular.module('zoomableApp', ['ui.router', 'ngMaterial', 'ngMessages', 'ngclipboard', 'ngFileUpload', 'angularMoment', 'chart.js'])
// Define standard theme for dashboard UI
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
  .primaryPalette('cyan', {
    'default': '700' // use shade 700 for default, and keep all other shades the same
  })
  .accentPalette('red');
})
.run(function ($rootScope) {
  // control searching in dashboard page (call from loginController to dashboardController)
  $rootScope.$on('searchEmit', function(event, args) {
    $rootScope.$broadcast('searchBroadcast', args);
  });
});
