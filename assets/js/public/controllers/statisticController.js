angular.module('zoomableApp').controller('statisticController', function($scope){
  // VARIABLES
  $scope.criteria = 'DAY';  // default set to day for date criteria

  /* Function to set date criteria */
  $scope.updateCriteria = function(event) {
    $scope.criteria = event.target.id.toUpperCase();
  };
});
