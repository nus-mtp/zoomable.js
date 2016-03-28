angular.module('zoomableApp').controller('statisticController', function($scope, $timeout, moment, servicesAPI){
  // VARIABLES
  $scope.location = location.pathname.split('/');           // location array contains path name in array[1]
  $scope.criteria = 'DAY';                                  // default set to day for date criteria
  $scope.endDate = new Date();                              // default end date is today's date
  $scope.maxDate = new Date();                              // default end date is today's date
  $scope.noStatisticsYet = false;                           // scope to track if statistics should be shown
  $scope.viewSessions = [];                                 // scope to store viewSessions to empty array
  $scope.userVideoLength = 0;                               // scope to store user uploaded video length

  /* Get all user view data required for stats */
  var init = function() {
    if ($scope.location[1] === 'statistics') {
      // get user account created date
      servicesAPI.getUserAccountDate().success(function (data) {
        $scope.accountCreatedDate = data.createdDate;

        // call stats api to get all of user's videos with stats
        servicesAPI.getVideoStats().success(function(data) {
          if (data.length === 0) {
            $scope.noStatisticsYet = true;
            $scope.userVideoLength = 0;
          }
          else {
            $scope.viewSessions = data.viewSessions;
            $scope.userVideoLength = data.videoLength;
            setStartAndMinDate($scope.accountCreatedDate);
          }
        });
      });
    }
    else if ($scope.location[1] === 'edit') {
      // call stats api for selected video with id = $scope.location[2]
      var uid = $scope.location[2];
      servicesAPI.getVideoStat(uid).success(function(data) {
        if (data.length === 0) {
          $scope.noStatisticsYet = true;
        }
        else {
          $scope.viewSessions = data.viewSessions;
          $scope.videoCreatedDate = data.createdDate;
          setStartAndMinDate($scope.videoCreatedDate);
        }
      });
    }
  };
  init();

  /* Function to set start and minimum date for statistics */
  function setStartAndMinDate(createdDate) {
    var oneMonthAgo = moment().subtract(1, 'months').toDate();

    // default start date is previous month if created date is more than a month ago
    if (moment(createdDate).isBefore(oneMonthAgo)) {
      $scope.startDate = moment(oneMonthAgo).toDate();
    }
    else {
      $scope.startDate = moment(createdDate).toDate();
    }
    // default min date is creation date
    $scope.minDate = moment(createdDate).toDate();
  };

  // Chart Variables
  $scope.series = ['Views'];  // default series to show for graph

  /* Function to initialise statistics data */
  $scope.initStatsView = function() {
    /* TODO: process stats accordingly to datepicker */

    // use sample data values for a month
    $scope.originalData = [
      [65, 59, 80, 81, 56, 55, 40, 28, 48, 40, 19, 86, 27, 90, 22,
        45, 67, 33, 50, 28, 78, 66, 91, 23, 72, 60, 20, 84, 88]
    ];

    // update the chart accordingly
    updateLabelsAndData();

    // get total views for selected date range (to update with real data)
    var length = $scope.originalData[0].length;
    var sum = 0;
    while (--length) {
      sum += $scope.originalData[0][length];
    }
    $scope.totalViewsSelected = sum + $scope.originalData[0][0];  // account for first element not added in while loop

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
    var endMoment = moment($scope.endDate).add(1, 'days');  // add an additional day to include end date

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
      for (var wk = startMoment.subtract(1,'days').add(1, 'weeks'); wk.isBefore(endMoment); wk.add(1, 'weeks')) {
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
            lastDayOfMth = endMoment.subtract(1, 'days'); // minus 1 to account for prev addition for loop
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
