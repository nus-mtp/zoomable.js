angular.module('zoomableApp').controller('statisticController', function($scope, $timeout, $filter,
   moment, servicesAPI, $q, $window, $timeout){
  // VARIABLES
  $scope.location = location.pathname.split('/');           // location array contains path name in array[1]
  $scope.criteria = 'DAY';                                  // default set to day for date criteria
  $scope.endDate = new Date();                              // default end date is today's date
  $scope.maxDate = new Date();                              // default end date is today's date
  $scope.noStatisticsYet = false;                           // scope to track if statistics should be shown
  $scope.viewSessions = [];                                 // scope to store viewSessions to empty array
  $scope.viewsCount = [];                                   // scope to store processed viewSessions into date and count
  $scope.userVideoLength = 0;                               // scope to store user uploaded video length
  $scope.videoURL = '';                                     // scope to store embed video URL

  // Get video id if location is on edit page
  if ($scope.location[1] === 'edit') {
    $scope.videoId = $scope.location[2];
    $scope.videoURL = location.origin + '/embed/' + $scope.videoId;
  }

  // CHART VARIABLES
  $scope.series = ['Views'];                                // default series to show for graph

  // HEATMAP VARIABLES
  var sessions = {};
  var compiledSessions = {};
  var videoTotalTime = 0;
  var video = new Whammy.Video(1);
  $scope.noHeatmapYet = true;

  /* Set delay in heatmap visualisation to prevent iframe from lagging */
  $timeout(getVideoViewData, 5000);

  /* Get view data of a video for heatmap visualisation */
  function getVideoViewData() {
    servicesAPI.getHeatMapStats($scope.videoId).success(function (data) {
      if (data.length > 0) {
        sessions = data;
        videoTotalTime = Math.floor(data[0].videoTotalTime);

        // group all coordinates by second
        sessions.forEach(function(session){

          // maximum canvas width is set at 128px x 72px
          // skip session if canvas width is at 128px which means canvas is not zoomed
          if (Math.floor(session.width) == 128) {
            return;
          }
          // Heatmap.js draw a point in circle by default
          // draw 4 points in order to draw a rectangular shape heatmap according to given coordinates and zoomed area width
          var zoomedCanvasWidth = Math.floor(session.width);
          var radius = zoomedCanvasWidth / 2;
          var horizontalDistance = Math.floor(zoomedCanvasWidth / 4);
          var verticalDistance = Math.floor( ((zoomedCanvasWidth / 128) * 72) / 4);

          // point 1
          var x1 = Math.floor(session.coordinates[0]) + horizontalDistance;
          var y1 = Math.floor(session.coordinates[1]) + verticalDistance;

          // point 2
          var x2 = Math.floor(session.coordinates[0]) + horizontalDistance * 3;
          var y2 = Math.floor(session.coordinates[1]) + verticalDistance;

          // point 3
          var x3 = Math.floor(session.coordinates[0]) + horizontalDistance;
          var y3 = Math.floor(session.coordinates[1]) + verticalDistance * 3;

          // point 4
          var x4 = Math.floor(session.coordinates[0]) + horizontalDistance * 3;
          var y4 = Math.floor(session.coordinates[1]) + verticalDistance * 3;

          compiledSessions[Math.floor(session.videoTime)] = compiledSessions[Math.floor(session.videoTime)] || [];
          compiledSessions[Math.floor(session.videoTime)].push({x: x1, y: y1, radius: radius});
          compiledSessions[Math.floor(session.videoTime)].push({x: x2, y: y2, radius: radius});
          compiledSessions[Math.floor(session.videoTime)].push({x: x3, y: y3, radius: radius});
          compiledSessions[Math.floor(session.videoTime)].push({x: x4, y: y4, radius: radius});
        });

        generateHeatmapVideo();
      }
    });
  };

  /* Generate a heatmap video by compiling heatmap canvas into a video  */
  var currentTime = 0
  function generateHeatmapVideo() {
    if (currentTime >= videoTotalTime) {
      compileHeatmapVideo();
    } else {
      // generate heatmap for a second if session exists
      if (compiledSessions.hasOwnProperty(currentTime)){
        coordinatesPerSecond( compiledSessions[currentTime]).then(function(context){
          video.add(context);
          currentTime++;
          generateHeatmapVideo();
        });
      }
      // generate empty canvas for seconds without sessions
      else {
        document.getElementsByClassName('heatmap-canvas')[0].setAttribute('id', 'heatmap-image');
        var context = document.getElementById('heatmap-image').getContext('2d');
        context.clearRect(0,0,1920,1080);
        context.fillStyle = '#FFFFFF';
        context.fillRect(0,0,1920,1080);
        video.add(context);
        currentTime++;
        generateHeatmapVideo();
      }
    }
  }

  var heatmapInstance = h337.create({
    container: document.getElementById('heatmap-canvas'),
    radius: 10,
    maxOpacity: .7,
    minOpacity: 0,
    blur: .8,
    backgroundColor: '#FFFFFF'
  });

  function coordinatesPerSecond(coordinates){
    var deferred = $q.defer();
    var aggregatedCoordinates = {
      max: coordinates.length,
      min: 0,
      data: coordinates
    };
    generateCanvas(aggregatedCoordinates).then(function() {
      document.getElementsByClassName('heatmap-canvas')[0].setAttribute('id', 'heatmap-image');
      var context = document.getElementById('heatmap-image').getContext('2d');
      // change canvas transparent background to white
      context.globalCompositeOperation = 'destination-over';
      context.fillStyle = '#FFFFFF';
      context.fillRect(0,0,1920,1080);
      deferred.resolve(context);
    });
    return deferred.promise;
  }

  function generateCanvas(aggregatedCoordinates) {
    var deferred = $q.defer();
    deferred.resolve(heatmapInstance.setData(aggregatedCoordinates));
    return deferred.promise;
  }

  function compileHeatmapVideo() {
    video.compile(false, function(output){
      $scope.noHeatmapYet = false;
      var url = window.URL.createObjectURL(output);
      document.getElementById('video').src = url;
    });
  }

  /* Restyle video iframes to exclude controls in statistics page */
  $('iframe#heatmap-iframe').load( function() {
    $('iframe#heatmap-iframe').contents().find('head')
      .append($('<style type="text/css">#miniMapControls,#zoomBarControls,#seekBarControls,#bottomBarControls{display:none;}</style>'));
  });
  $('iframe#heatmap-iframe2').load( function() {
    $('iframe#heatmap-iframe2').contents().find('head')
      .append($('<style type="text/css">  #seekBarControls,#bottomBarControls{display:none;}</style>'));
  });

  /* Sync play events of iframes from heatmap video */
  document.getElementById('video').onplay = function() {
    $('iframe#heatmap-iframe').contents().find('#playPauseBtn').click();
    $('iframe#heatmap-iframe2').contents().find('#playPauseBtn').click();
  };
  document.getElementById('video').onpause = function() {
    $('iframe#heatmap-iframe').contents().find('#playPauseBtn').click();
    $('iframe#heatmap-iframe2').contents().find('#playPauseBtn').click();
  };

  /* Get all user view data required for stats */
  var init = function() {
    if ($scope.location[1] === 'statistics') {
      // get user account created date
      servicesAPI.getUserAccountDate().success(function (data) {
        $scope.accountCreatedDate = data.createdDate;

        // call stats api to get all of user's videos with stats
        servicesAPI.getVideoStats().success(function(data) {
          if (data.length === 0 || data.viewSessions.length === 0) {
            $scope.noStatisticsYet = true;
            $scope.userVideoLength = data.length === 0 ? 0 : data.videoLength;
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
      // call stats api for selected video
      servicesAPI.getVideoStat($scope.videoId).success(function(data) {
        if (data.length === 0 || data.viewSessions.length === 0) {
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
  }

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
  }

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

    // initialse scope label, data and other variables
    $scope.labels = [];
    $scope.data = [[]];
    $scope.totalViewsForPeriod = 0;
    var vc_index = 0;
    var count = 0;
    var idx, sum, formatedVCDate;

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
      for (idx = 0; idx < $scope.labels.length; idx++) {

        // add all view counts from the array
        if (vc_index < $scope.viewsCount.length) {
          // format view count date to same format as labels
          formatedVCDate = moment($scope.viewsCount[vc_index].date).format('D/M');

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
        else {
          // add count of zero for rest of the remaining days not including in viewsCount array
          $scope.data[0][idx] = 0;
        }
      }
    }
    else if ($scope.criteria === 'WEEK') {
      // create date clone   for manipulation (moments are mutable)
      var startMomentCopy = startMoment.clone();
      // set start moment copy to 1 week after start date
      startMomentCopy.subtract(1,'days').add(1, 'weeks');
      // set end moment to one week after end date to include extra days that don't add up to a week
      endMoment.add(1, 'weeks');
      // populate the labels
      for (var wk = startMomentCopy; wk.isBefore(endMoment); wk.add(1, 'weeks')) {
        $scope.labels.push(wk.format('D/M'));
        count++;
      }

      // update the data to show
      for (idx = 0; idx < count; idx++) {
        // for each count add up the sum of the next 7 days for subsequent week
        sum = 0;
        for (var day = 0; day < 7; day++) {
          // add all view counts from the array
          if (vc_index < $scope.viewsCount.length) {
            // format view count date to same format as labels
            formatedVCDate = moment($scope.viewsCount[vc_index].date).format('D/M');

            if (startMoment.format('D/M') === formatedVCDate) {
              // add to sum if date is the same
              sum = sum + $scope.viewsCount[vc_index].count;
              // add to total view count for selected period
              $scope.totalViewsForPeriod = $scope.totalViewsForPeriod + $scope.viewsCount[vc_index].count;
              // increase vc_index
              vc_index++;
            }
          }
          // increment start date by one for each day
          startMoment.add(1, 'days');
        }
        // update scope data for the week
        $scope.data[0][idx] = sum;
      }
    }
    else if ($scope.criteria === 'MONTH') {
      // populate the labels
      for (var mth = moment(startMoment).startOf('month'); mth.isBefore(endMoment); mth.add(1, 'months')) {
        $scope.labels.push(mth.format('MMM/YY'));
        count++;
      }

      // get month of startMoment
      var currentMonth = moment(startMoment).month();
      // create a copy of $scope.viewsCount
      var vcArr = $scope.viewsCount.slice(0);

      // update the data to show
      for (idx = 0; idx < count; idx++) {
        sum = 0;

        // add all view counts from the array
        for (var i = 0; i < vcArr.length; i++) {
          if (moment(vcArr[i].date).month() === currentMonth) {
            // add to sum if month is the same
            sum = sum + vcArr[i].count;
            // add to total view count for selected period
            $scope.totalViewsForPeriod = $scope.totalViewsForPeriod + vcArr[i].count;
          }
          else {
            // splice added count from vcArray
            vcArr.splice(0, i);
            break;
          }
        }
        // update scope data for the month
        $scope.data[0][idx] = sum;
        // increment month
        currentMonth++;
      }
    }
  }

});
