angular.module('zoomableApp')
  /* NAVBAR DIRECTIVE */
  .directive('navbar', function () {
    return {
      restrict: 'A', //This means that it will be used as an attribute and NOT as an element.
      replace: true,
      scope: {},
      templateUrl: "../../../views/navbar.html",
      controller: ['$scope', '$filter', function ($scope, $filter) {
          // TODO: USER AUTHENTICATION TO SHOW OR HIDE NAVBAR
          $scope.user = true;  // set to true for now
      }]
    }
  });
