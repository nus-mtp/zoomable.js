angular.module('zoomableApp').controller('statisticController', function($scope, moment){
  // VARIABLES
  $scope.criteria = 'DAY';  // default set to day for date criteria
  $scope.startDate = moment().subtract(1, 'month').toDate();  // default start date is previous month
  $scope.minDate = moment().subtract(1, 'month').toDate();  // default min date is previous month
  $scope.endDate = new Date();  // default end date is current date
  $scope.maxDate = new Date();  // default max date is current date

  /* Function to set date criteria */
  $scope.updateCriteria = function(event) {
    $scope.criteria = event.target.id.toUpperCase();
  };
});
