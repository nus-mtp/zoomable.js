angular.module('appRoutes', []).config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  // Redirect unmatched URL to state1
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('state1', {
      url: "/",
      templateUrl: "views/login.html",
      controller: 'loginController'
    })
    .state('state2', {
      url: "/dashboard",
      templateUrl: "views/dashboard.html",
      controller: 'dashboardController'
    });

}]);
