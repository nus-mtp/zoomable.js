angular.module('zoomableApp').controller('dashboardController', function($scope, servicesAPI, $mdDialog, $mdMedia, Upload, $timeout){

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
            '<md-dialog style="min-width:500px;min-height:200px" id="dialog-upload">' +
                '<div class="md-toolbar-tools" style="border-bottom: 1px solid gainsboro;">' +
                    '<h2>Upload Video to Zoomable</h2>' +
                    '<span flex></span>' +
                    '<md-button class="md-icon-button" ng-click="cancel()">' +
                        '<md-icon md-svg-src="images/ic_clear_black_24px.svg" aria-label="Close dialog"></md-icon>' +
                    '</md-button>' +
                '</div>' +
                '<md-dialog-content style="padding:50px;text-align:center">' +
                    '<div id="ngProgress-container"><div id="ngProgress"></div></div>' +
                    '<md-content>'+
                        'Choose videos to upload to Zoomable. You may select more than one video at a time. Recommended quality: <b>HD 1080p and higher.</b>'+
                    '</md-content>' +
                    '<div ng-show="uploadedFiles" ng-repeat="file in uploadedFiles">' +
                        '{{file}}' +
                    '</div>' +
                    '<md-dialog-actions style="justify-content:center;padding-top:30px">' +
                        '<div ngf-drop ngf-select ng-model="files" class="drop-box" ngf-drag-over-class="dragover" ngf-multiple="true" ngf-allow-dir="true"'+
                        'accept="image/*" ngf-pattern="image/*">Drag videos here</br>or click to upload.</div>'+
                    '</md-dialog-actions>' +
                '</md-dialog-content>' +
            '</md-dialog>',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen
        });
    };

    function DialogController($scope, $mdDialog, Upload, $timeout) {
        // variable
        $scope.files;
        $scope.uploadedFiles;

        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });

        // function to upload individual video
        $scope.upload = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                  var file = files[i];
                  if (!file.$error) {
                    servicesAPI.upload(file)
                        .then(function(uploadedFile) {
                            console.log(uploadedFile);
                            uploadedFiles.push(uploadedFile);
                            getVideoList();
//                            $mdDialog.hide();
                        });
                  }
                }
            }
        };

        $scope.start_contained = function($event) {
                $scope.contained_progressbar.start();
                $event.preventDefault();
        }

        $scope.complete_contained = function($event) {
                $scope.contained_progressbar.complete();
                $event.preventDefault();
        }

        $scope.reset_contained = function($event) {
                $scope.contained_progressbar.reset();
                $event.preventDefault();
        }

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }

    /* Function to catch broadcast event from login controller to perform search on video list */
    $scope.$on('searchBroadcast', function(event, query) {
        $scope.filterType = query;
    });
});
