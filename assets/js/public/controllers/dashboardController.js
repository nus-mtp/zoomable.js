angular.module('zoomableApp').controller('dashboardController', function($scope, servicesAPI, $mdDialog,
   $mdMedia, Upload, $timeout, $interval, $location, $q){
  // ERROR MESSAGE
  var ServiceUnavailableError = 'Service is unavailable at the moment. :(';
  var NoVideoError = 'No Video Yet';

  // VARIABLES
  $scope.filterStates = ['Public','Private','All'];
  $scope.sortStates = ['Latest','Most Viewed'];
  $scope.userFilterState = '';
  $scope.userSortState = '';
  $scope.hasMouseover = 'hidden';
  $scope.videoList = [];

  $scope.model = {
    selectedVideoList: []
  };

  /* Update video list */
  getVideoList();

  /* Get a list of video from API */
  function getVideoList() {
    servicesAPI.get()
      .success(function(data) {
        if (data.length === 0) {
          $scope.error = NoVideoError;
        }
        $scope.videoList = data;
        getProcessStatusAll();
      })
      .error(function() {
        $scope.error = ServiceUnavailableError;
      });
  }

  /* Checkbox Handler */
  $scope.isSelectAll = function() {
    $scope.model.selectedVideoList = [];

    if($scope.master) {
      for(var i=0;i<$scope.videoList.length;i++) {
          $scope.model.selectedVideoList.push($scope.videoList[i].id);
      }
    }

    angular.forEach($scope.videoList, function (video) {
      video.selected = $scope.master;
    });
  }
  $scope.isLabelChecked = function() {
    var id = this.video.id;
    if (this.video.selected) {
      $scope.model.selectedVideoList.push(id);
      if ($scope.model.selectedVideoList.length == $scope.videoList.length) {
        $scope.master = true;
      }
    } else {
      $scope.master = false;
      var index = $scope.model.selectedVideoList.indexOf(id);
      $scope.model.selectedVideoList.splice(index, 1);
    }
  }

  /* Dialog Handler for delete action by checkbox */
  $scope.showConfirmDeleteByCheckbox = function(ev) {
    // check if at least 1 video is checked
    if($scope.model.selectedVideoList.length > 0) {
      var MESSAGE_VIDEO = 'videos';

      // check plural for confirm dialog text
      if($scope.model.selectedVideoList.length === 1) {
        MESSAGE_VIDEO =  MESSAGE_VIDEO.substring(0, MESSAGE_VIDEO.length - 1);
      }

      // appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('Delete Video?')
        .textContent('Are you sure you want to delete ' + $scope.model.selectedVideoList.length + ' ' + MESSAGE_VIDEO + '?')
        .ariaLabel('Confirm Dialog')
        .targetEvent(ev)
        .ok('Confirm')
        .cancel('Cancel')
        .clickOutsideToClose(true);
      $mdDialog.show(confirm).then(function() {
        var arrayIds = {
          id : $scope.model.selectedVideoList
        }
        servicesAPI.deleteAll(arrayIds).then(function() {
          getVideoList();
        });
        // Empty video list
        $scope.model.selectedVideoList = [];
        });
    } else {
        return;
    }
  };

  /* Dialog Handler for delete action by button */
  $scope.showConfirmDeleteByButton = function(ev,video) {
    // append dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
      .title('Delete Video?')
      .textContent('Are you sure you want to delete ' + video.title + ' video?')
      .ariaLabel('Confirm Dialog')
      .targetEvent(ev)
      .ok('Confirm')
      .cancel('Cancel')
      .clickOutsideToClose(true);
    $mdDialog.show(confirm).then(function() {
      servicesAPI.delete(video.id).then(function() {
        getVideoList();
      });
    });
  };

  /* Sort video list according to sort states */
  $scope.updateSortState = function (state) {
    $scope.userSortState = state;
    if ($scope.userSortState === 'Latest') {
      $scope.sortType = '-createdAt';
    } else if ($scope.userSortState === 'Most Viewed') {
      $scope.sortType = '-viewedSessions.length';
    }
  };

  /* Sort video list according to filter states */
  $scope.updateFilterState = function (state) {
    $scope.userFilterState = state;
    if ($scope.userFilterState === 'Public') {
      $scope.filterType = { privacy: 1 };
    } else if ($scope.userFilterState === 'Private') {
      $scope.filterType = { privacy: 0 };
    } else if ($scope.userFilterState === 'All') {
      $scope.filterType = {};
    }
  };

  /* Upload dialog handler */
  $scope.showUpload = function (ev) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: DialogController,
      template:
        '<md-dialog id="dialog-upload">' +
            '<div class="md-toolbar-tools">' +
                '<h2>Upload Video to Zoomable</h2>' +
                '<span flex></span>' +
                '<md-button class="md-icon-button" ng-click="cancel()">' +
                    '<md-icon md-svg-src="images/ic_clear_black_24px.svg" aria-label="Close dialog"></md-icon>' +
                '</md-button>' +
            '</div>' +
            '<md-dialog-content>' +
                '<md-content>'+
                    'Choose videos to upload to Zoomable. You may select more than one video at a time. Recommended quality: <b>HD 1080p and higher.</b>'+
                '</md-content>' +
                '<div class="uploaded-files-list" ng-class="{ outline: uploadedFiles.length > 0 }">' +
                    '<div ng-show="uploadedFiles" ng-repeat="file in uploadedFiles">' +
                        '<div id="loading-bar" class="loading-bar"><div class="filename">{{ file.name }}</div><div class="filesize">{{ file.calculatedsize }}</div></div>' +
                    '</div>' +
                '</div>'+
                '<div id="toast-error"></div>' +
                '<md-dialog-actions>' +
                    '<div ngf-drop ngf-select ng-model="files" class="drop-box" ngf-drag-over-class="dragover" ngf-multiple="true" ngf-allow-dir="true"'+
                    'accept="video/*" ngf-pattern="video/*">Drag videos here</br>or click to upload.</div>'+
                '</md-dialog-actions>' +
                '<md-dialog-actions ng-show="uploadedFiles.length > 0">' +
                  '<md-button class="md-raised md-primary" ng-click="cancel()">Done</md-button>' +
                '</md-dialog-actions>' +
            '</md-dialog-content>' +
        '</md-dialog>',
      parent: angular.element(document.body),
      targetEvent: ev,
      fullscreen: useFullScreen
    });
  };

  /* Upload Dialog Controller */
  function DialogController($scope, $mdDialog, Upload, $timeout, ngProgressFactory, $mdToast) {
    // error Messages
    var ERROR_UNSUPPORTED_FORMAT = 'is an unsupported video format. Please upload video in MP4 or MOV format only.';

    // variables
    $scope.files;
    $scope.uploadedFiles = [];
    $scope.progressBar = ngProgressFactory.createInstance();

    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });

    // upload videos to API
    $scope.upload = function (files) {
      if (files && files.length) {
        // append files to the uploaded files array
        for (var i = 0; i < files.length; i++) {

          // check for unsupported video format
          if ( !((files[i].type !== 'video/mp4') || (files[i].type !== 'video/quicktime'))) {
            // show toast message if file format is unsupported
            var toast = $mdToast.simple()
              .content(files[i].name + ' ' + ERROR_UNSUPPORTED_FORMAT)
              .action('X').highlightAction(true)
              .hideDelay(8000)
              .position('top center')
              .parent(document.getElementById('toast-error'));
            $mdToast.show(toast);

          } else {
            files[i].calculatedsize = formatBytes(files[i].size);
            $scope.uploadedFiles.push(files[i]);
          }

        }
        if ($scope.uploadedFiles.length > 0) {
          // Upload files to server
          for (var j = 0; j < files.length; j++) {
            var file = files[j];

            if (!file.$error) {
              createAndUploadVideo(file);
            }
          }
        }
      }
    };

    /* Return promise after creating a video entry and uploading video */
    function createAndUploadVideo(file) {
      var deferred = $q.defer();

      var videoName = { title: file.name };
      // call api to create a video entry
      servicesAPI.createVideo(videoName).then(function (res) {
        // append new video entry to existing video list
        file.id = res.data.id;
        // set progress bar for uploading video
        $scope.progressBar.setParent(document.getElementById('loading-bar'));
        $scope.progressBar.setColor('#66b38a');
        $scope.progressBar.setHeight('20px');
        $scope.progressBar.start();

        servicesAPI.upload(file)
          .then(function () {

            // update upload progress bar of video to be completed
            $scope.progressBar.complete();
            var bar = angular.element( document.getElementById('loading-bar') );
            bar.removeAttr('id');
            bar.addClass('completed-bar');
            deferred.resolve(null);
          });
      });
      return deferred.promise;
    }

    function formatBytes(bytes) {
      if (bytes < 1024) return bytes + ' Bytes';
      else if(bytes < 1048576) return(bytes / 1024).toFixed(1) + ' KB';
      else if(bytes < 1073741824) return(bytes / 1048576).toFixed(1) + ' MB';
      else return(bytes / 1073741824).toFixed(1) + ' GB';
    }

    $scope.cancel = function() {
      $scope.uploadedFiles = [];
      getVideoList();
      $mdDialog.cancel();
    };
  }

  /* Check process status for all video entries */
  function getProcessStatusAll() {
    if ($scope.videoList){
      $scope.error = '';

      for (var i = 0; i < $scope.videoList.length; i++) {
        if ($scope.videoList[i].hasProcessed === 'false') {
          var videoId = {
            id : $scope.videoList[i].id
          }
          getProcessStatus(videoId);
        }
      }
    }
  }

  /* Get process status of a video from API every 5 seconds */
  function getProcessStatus (videoId) {
    var interval = $interval(function() {
      var hasVideo = false;
      var video_index = 0;

      // check if video entry exists in video list
      for (var i=0; i<$scope.videoList.length; i++) {

        if (videoId.id === $scope.videoList[i].id) {
          hasVideo = true;
          video_index = i;

          servicesAPI.getUploadProgress(videoId).then(function (res) {
            // check if process status is completed
            if (res.data.status) {
              // update video list once video is processed
              getVideoList();
              $interval.cancel(interval);
            }
          }).catch( function () {
            // if video processing has error, show error message to user
            $scope.videoList[video_index].error = 'Error processing video. Please upload again. :(';
            $interval.cancel(interval);
          });
        }
      }

      // cancel interval if user deletes the video entry
      if (!hasVideo) {
        $interval.cancel(interval);
      }

    }, 1000);
  }

  /* Function to catch broadcast event from login controller to perform search on video list */
  $scope.$on('searchBroadcast', function(event, query) {
    $scope.filterType = query;
  });
});
