angular.module('appRoutes', []).config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('login', {
      url: "/",
      templateUrl: "views/login.html",
      controller: 'loginController',
      authenticate: false
    })
    .state('dashboard', {
      url: "/dashboard",
      templateUrl: "views/dashboard.html",
      controller: 'dashboardController',
      authenticate: true
    })
    .state('edit', {
      url: "/edit/:videoId",
      templateUrl: "views/edit.html",
      controller: 'editController',
      authenticate: true
    });

  // Otherwise redirect unmatched URL to login state
  $urlRouterProvider.otherwise("/");

}]);

// AUTHENTICATE ON ROUTE CHANGES
angular.module("zoomableApp").run(function ($rootScope, $state, authService) {
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.authenticate && !authService.isAuthenticated()){
      // User isn’t authenticated
      $state.transitionTo("login");
      event.preventDefault();
    }
  });
});
