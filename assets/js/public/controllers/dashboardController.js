angular.module('zoomableApp').controller('dashboardController', function($scope, servicesAPI, $mdDialog, $mdMedia){

    // VARIABLES
    $scope.defaultImagePath = 'images/bunny.png';
    $scope.filterStates = ['Public','Private'];
    $scope.sortStates = ['Latest','Most Viewed'];
    $scope.userFilterState = '';
    $scope.userSortState = '';
    $scope.hasMouseover = 'hidden';
    var videoData = {};
    var uploadUrl = '/upload';

    $scope.model = {
        selectedVideoList : []
    }

    getVideoList();

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

    /* Dialog Handler for delete action by checkbox */
    $scope.showConfirmDeleteByCheckbox = function(ev) {
        // Check if at least 1 video is checked
        if($scope.model.selectedVideoList.length > 0) {

            var MESSAGE_VIDEO = 'videos';

            // Check plural for confirm dialog text
            if($scope.model.selectedVideoList.length === 1) {
               MESSAGE_VIDEO =  MESSAGE_VIDEO.substring(0, MESSAGE_VIDEO.length - 1);
            }

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Delete Video?')
                  .textContent('Are you sure you want to delete ' + $scope.model.selectedVideoList.length + ' ' + MESSAGE_VIDEO + '?')
                  .ariaLabel('Confirm Dialog')
                  .targetEvent(ev)
                  .ok('Confirm')
                  .cancel('Cancel')
                  .clickOutsideToClose(true);
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

    /* Dialog Handler for delete action by button */
    $scope.showConfirmDeleteByButton = function(ev,video) {
        // Appending dialog to document.body to cover sidenav in docs app
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

    /* Sort video list according to filter states */
    $scope.updateSortState = function (state) {
        $scope.userSortState = state;
        if ($scope.userSortState === 'Latest') {
            $scope.sortType = '-createdAt';
        } else if ($scope.userSortState === 'Most Viewed') {
            $scope.sortType = '-views';
        }
    };

    /* Sort video list according to filter states */
    $scope.updateFilterState = function (state) {
        $scope.userFilterState = state;
        if ($scope.userFilterState === 'Public') {
            $scope.filterType = { privacy : 1 };
        } else if ($scope.userFilterState === 'Private') {
            $scope.filterType = { privacy : 0 };
        }
    };

    /* Get a list of video from API */
    function getVideoList() {
        servicesAPI.get()
        .success(function(data) {
          $scope.videoList = data;
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    }

    $scope.showUpload = function (ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
          controller: DialogController,
          template:
            '<md-dialog style="min-width:500px;min-height:200px">' +
            '   <md-toolbar>' +
            '       <div class="md-toolbar-tools">' +
            '           <h2>Upload Video to Zoomable</h2>' +
            '           <span flex></span>' +
            '       <md-button class="md-icon-button" ng-click="cancel()">' +
            '           <md-icon md-svg-src="images/ic_clear_white_24px.svg" aria-label="Close dialog"></md-icon>' +
            '       </md-button>' +
            '   </div>' +
            '   </md-toolbar>' +
            '   <md-dialog-content style="padding:50px;text-align:center">' +
            '       <md-content>Choose videos to upload to Zoomable. You may select more than one video at a time. Recommended quality: HD and above.</md-content>' +
            '       <md-dialog-actions style="justify-content:center;padding-top:30px"><input class="ng-hide" id="file-input" type="file" multiple="multiple" file-model="videoFile">' +
            '           <md-button id="uploadButton" class="md-raised md-primary" aria-label="upload video file" ng-click="test(\'why\')">' +
            '           <label>Upload</label>' +
            '           </md-button>' +
            '       </md-dialog-actions>' +
            '   </md-dialog-content>' +
            '</md-dialog>',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen
        })
        .then(function(test) {
            console.log(test);
        });
    };

    $scope.uploadVideoFile = function(filelist) {
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
    }
});