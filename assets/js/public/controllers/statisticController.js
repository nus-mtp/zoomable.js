angular.module('zoomableApp').controller('statisticController', function($scope, $timeout, moment){
  // VARIABLES
  $scope.criteria = 'DAY';  // default set to day for date criteria
  $scope.startDate = moment().subtract(1, 'months').toDate();  // default start date is previous month
  $scope.minDate = moment().subtract(1, 'months').toDate();  // default min date is previous month
  $scope.endDate = moment().subtract(1, 'days').toDate();  // default end date is current date - 1
  $scope.maxDate = moment().subtract(1, 'days').toDate();  // default max date is current date - 1

  // Chart Variables
  $scope.series = ['Views'];  // default series to show for graph

  /* Function to initialise statistics data */
  $scope.init = function() {
    // TODO: Call API to get default selected date range data

    // use sample data values for a month
    $scope.originalData = [
      [65, 59, 80, 81, 56, 55, 40, 28, 48, 40, 19, 86, 27, 90, 22,
        45, 67, 33, 50, 28, 78, 66, 91, 23, 72, 60, 20, 84, 88]
    ];

    // update the chart accordingly
    updateLabelsAndData();
  };

  /* Function to get data for selected date range */
  $scope.getSelectedDateData = function() {
    console.log('not implemented yet');
    
    // TODO: Call API to get default selected date range data
  };

  /* Function to set date criteria */
  $scope.updateCriteria = function(event) {
    $scope.criteria = event.target.id.toUpperCase();
    updateLabelsAndData();
  };

  /* Function to update chart data and labels */
  function updateLabelsAndData() {
    var count = 0;
    var prevDate = 0;

    // clear previous scope labels
    $scope.labels = [];
    $scope.data = [[]];

    // convert Javascript Date object to Moment object
    var startMoment = moment($scope.startDate);
    var endMoment = moment($scope.endDate);

    // update the labels and data to use for chart
    if ($scope.criteria === 'DAY') {
      // populate the labels
      for (var idx = startMoment; idx.isBefore(endMoment); idx.add(1, 'days')) {
        $scope.labels.push(idx.format('D/M'));
      }

      // update the data to show
      $scope.data = $scope.originalData;
    }
    else if ($scope.criteria === 'WEEK') {
      // populate the labels
      for (var wk = startMoment.add(1, 'weeks'); wk.isBefore(endMoment); wk.add(1, 'weeks')) {
        $scope.labels.push(wk.format('D/M'));
        count++;
      }

      // update the data to show
      for (var idx = 0; idx < count; idx++) {
        // for each count add up the sum of the next 7 days for subsequent week
        var sum = 0;
        for (var day = prevDate; day < (prevDate+7); day++) {
          sum = sum + $scope.originalData[0][day];
        }
        $scope.data[0][idx] = sum;
        prevDate = prevDate + 7;
      }
    }
    else if ($scope.criteria === 'MONTH') {
      // populate the labels
      for (var mth = moment(startMoment).startOf('month'); mth.isBefore(endMoment); mth.add(1, 'months')) {
        $scope.labels.push(mth.format('MMM/YY'));
        count++;
      }

      // get last day of the startMoment month
      var lastDayOfMth = moment(startMoment).endOf('month');
      // get number of days to calculate statistics for startMoment month
      var noOfDays = lastDayOfMth.diff(startMoment, 'days') + 1;

      // update the data to show
      for (var idx = 0; idx < count; idx++) {
        // for each count add up the sum of the next month
        var sum = 0;
        if (idx !== 0) {
          // count number of days in stated month except for startMoment month
          var startOfMth = moment(startMoment).startOf('month').add(idx, 'months');
          if (idx === (count-1)) {
            // last day of the month will be the endMoment date instead
            lastDayOfMth = endMoment;
          }
          else {
            lastDayOfMth = moment(startOfMth).endOf('month');
          }
          noOfDays = lastDayOfMth.diff(startOfMth, 'days') + 1;

        }
        for (var day = prevDate; day < (prevDate+noOfDays); day++) {
          sum = sum + $scope.originalData[0][day];
        }
        $scope.data[0][idx] = sum;
        prevDate = prevDate + noOfDays;
      }
    }
  };

});
