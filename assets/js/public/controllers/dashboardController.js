angular.module('zoomableApp').controller('dashboardController', function($scope, servicesAPI, $mdDialog, $mdMedia){

    // VARIABLES
    $scope.defaultImagePath = 'images/bunny.png';
    $scope.filterStates = ['Public','Private'];
    $scope.sortStates = ['Lastest','Most Viewed'];
    $scope.userFilterState = '';
    $scope.userSortState = '';
    $scope.hasMouseover = 'hidden';
    var videoData = {};
    var uploadUrl = '/upload';

    $scope.model = {
        selectedVideoList : []
    }

    getVideoList();

    /* Delete Video */
    $scope.deleteVideo = function(videoID) {
        servicesAPI.delete(videoID).then(function() {
            getVideoList();
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
        if(this.video.selected) {
            $scope.model.selectedVideoList.push(id);
            if($scope.model.selectedVideoList.length == $scope.videoList.length){$scope.master = true;}
        } else {
            $scope.master = false;
            var index = $scope.model.selectedVideoList.indexOf(id);
            $scope.model.selectedVideoList.splice(index, 1);
        }
    }

    /* Dialog Handler for Delete Action */
    $scope.showConfirmDelete = function(ev) {
        // Check if at least 1 video is checked
        if($scope.model.selectedVideoList.length > 0) {

            var MESSAGE_VIDEO = 'videos';

            // Check plural for confirm dialog text
            if($scope.model.selectedVideoList.length === 1) {
               MESSAGE_VIDEO =  MESSAGE_VIDEO.substring(0, MESSAGE_VIDEO.length - 1);
            }

            // DIALOGUE MESSAGES
            var MESSAGE_TITLE_DELETE = 'Delete Video?';
            var MESSAGE_TEXT_CONTENT_DELETE = 'Are you sure you want to delete ' + $scope.model.selectedVideoList.length + ' ' + MESSAGE_VIDEO + '?';

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title(MESSAGE_TITLE_DELETE)
                  .textContent(MESSAGE_TEXT_CONTENT_DELETE)
                  .ariaLabel('Confirm Dialog')
                  .targetEvent(ev)
                  .ok('Confirm')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                    for(var i=0;i<$scope.model.selectedVideoList.length;i++) {
                        servicesAPI.delete($scope.model.selectedVideoList[i]).then(function() {
                            getVideoList();
                        });
                    }
                // Empty video list
                $scope.model.selectedVideoList = [];
            });
        } else {
            return;
        }
    };

    /* Sort video list according to filter states */
    $scope.updateSortState = function (state) {
        $scope.userSortState = state;
        if ($scope.userSortState === 'Lastest') {
            $scope.sortType = '-createdAt';
        } else if ($scope.userSortState === 'Most Viewed') {
            $scope.sortType = '-views';
        }
    };

    /* Sort video list according to filter states */
    $scope.updateFitlerState = function (state) {
        $scope.userFilterState = state;
        if ($scope.userFilterState === 'Public') {
            $scope.filterType = 'privacy';
        } else if ($scope.userFilterState === 'Private') {
            $scope.filterType = '-privacy';
        }
    };

    /* GET Video Object */
    function getVideoList() {
        servicesAPI.get()
        .success(function(data) {
          $scope.videoList = data;
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    }

    /* To display confirmation dialog */
    function DialogController($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    }

    $scope.uploadVideoFile = function (filelist) {
        for (var i = 0; i < filelist.length; ++i) {
            var file = filelist.item(i);

            videoData = {
              title : file.name,
              videoDir : uploadUrl,
              thumbnailDir : uploadUrl
            };

            servicesAPI.create(videoData)
            .success(function(data) {
                videoData = {};
                getVideoList();
            })
            .error(function(data) {
              console.log('Error: ' + data);
            });
        }
    };

});
