angular.module('zoomableApp').controller('statisticController', function($scope, moment){
  // VARIABLES
  $scope.criteria = 'DAY';  // default set to day for date criteria
  $scope.startDate = moment().subtract(1, 'months').toDate();  // default start date is previous month
  $scope.minDate = moment().subtract(1, 'months').toDate();  // default min date is previous month
  $scope.endDate = moment().subtract(1, 'days').toDate();  // default end date is current date - 1
  $scope.maxDate = moment().subtract(1, 'days').toDate();  // default max date is current date - 1

  /* Function to set date criteria */
  $scope.updateCriteria = function(event) {
    $scope.criteria = event.target.id.toUpperCase();
  };
});
