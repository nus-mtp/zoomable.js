angular.module('zoomableApp').controller('statisticController', function($scope, $timeout, $filter, moment, servicesAPI){
  // VARIABLES
  $scope.location = location.pathname.split('/');           // location array contains path name in array[1]
  $scope.criteria = 'DAY';                                  // default set to day for date criteria
  $scope.endDate = new Date();                              // default end date is today's date
  $scope.maxDate = new Date();                              // default end date is today's date
  $scope.noStatisticsYet = false;                           // scope to track if statistics should be shown
  $scope.viewSessions = [];                                 // scope to store viewSessions to empty array
  $scope.viewsCount = [];                                   // scope to store processed viewSessions into date and count
  $scope.userVideoLength = 0;                               // scope to store user uploaded video length

  // CHART VARIABLES
  $scope.series = ['Views'];                                // default series to show for graph

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
            processViewSessions();
            updateLabelsAndData();
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
          processViewSessions();
          updateLabelsAndData();
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

  /* Function to order view sessions and count by date */
  function processViewSessions() {
    // order view sessions in ascending order
    var orderByDate = $filter('orderBy')($scope.viewSessions, 'createdAt', false);
    // track viewsCount array index
    var vc_index = 0;
    // convert time to local time zone
    var localTime  = moment.utc(orderByDate[0].createdAt).toDate();

    // create a session obj and push to viewsCount array
    var sessionObj = {
      date: moment(localTime).format('YYYY-MM-DD HH:mm:ss'),
      count: 1
    }
    $scope.viewsCount.push(sessionObj);

    for (var i=1; i<orderByDate.length; i++) {
      if (moment(orderByDate[i].createdAt).isSame(moment(orderByDate[i-1].createdAt), 'day')) {
        // if same date, add to count of the current viewsCount[vc_index]
        $scope.viewsCount[vc_index].count++;
      }
      else {
        localTime  = moment.utc(orderByDate[i].createdAt).toDate();
        // push new sessionObj into viewsCount array and increment vc_index
        sessionObj = {
          date: moment(localTime).format('YYYY-MM-DD HH:mm:ss'),
          count: 1
        }
        $scope.viewsCount.push(sessionObj);
        vc_index++;
      }
    }
  };

  /* Function to set date criteria */
  $scope.updateCriteria = function(event) {
    $scope.criteria = event.target.id.toUpperCase();
    updateLabelsAndData();
  };

  $scope.updateDate = function(start, end) {
    // pass start and end date again to make sure scope from view is updated correctly
    $scope.startDate = start;
    $scope.endDate = end;
    updateLabelsAndData();
  };

  /* Function to update chart data and labels */
  function updateLabelsAndData() {
    var prevDate = 0;

    // initialse scope label, data and other variables
    $scope.labels = [];
    $scope.data = [[]];
    $scope.totalViewsForPeriod = 0;
    var vc_index = 0;
    var count = 0;

    // convert Javascript Date object to Moment object
    var startMoment = moment($scope.startDate).startOf('day');
    var endMoment = moment($scope.endDate).add(1, 'days').startOf('day');  // add an additional day to include end date

    // update the labels and data to use for chart
    if ($scope.criteria === 'DAY') {
      // populate the labels
      for (var dd = startMoment; dd.isBefore(endMoment); dd.add(1, 'days')) {
        $scope.labels.push(dd.format('D/M'));
      }

      // update the data to show
      for (var idx = 0; idx < $scope.labels.length; idx++) {
        // format view count date to same format as labels
        var formatedVCDate = moment($scope.viewsCount[vc_index].date).format('D/M');
        if ($scope.labels[idx] === formatedVCDate) {
          // assign count to data[0] scope if date is the same
          $scope.data[0][idx] = $scope.viewsCount[vc_index].count;
          // add to total view count for selected period
          $scope.totalViewsForPeriod = $scope.totalViewsForPeriod + $scope.viewsCount[vc_index].count;
          // increase vc_index
          vc_index++;
        }
        else {
          // add count to be zero if date is not the same
          $scope.data[0][idx] = 0;
        }
      }
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
