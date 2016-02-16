angular.module('appRoutes', []).config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  // Redirect unmatched URL to login state
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('login', {
      url: "/",
      templateUrl: "views/login.html",
      controller: 'loginController'
    })
    .state('dashboard', {
      url: "/dashboard",
      templateUrl: "views/dashboard.html",
      controller: 'dashboardController'
    })
    .state('edit', {
      url: "/edit/:videoId",
      templateUrl: "views/edit.html",
      controller: 'editController'
    });

}]);
