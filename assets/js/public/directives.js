angular.module('zoomableApp')
  /* NAVBAR DIRECTIVE */
  .directive('navbar', function () {
    return {
      restrict: 'A', //This means that it will be used as an attribute and NOT as an element.
      replace: true,
      templateUrl: "../../../views/navbar.html"
    }
  });
