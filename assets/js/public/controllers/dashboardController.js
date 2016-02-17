angular.module('zoomableApp').controller('dashboardController', function($scope, servicesAPI, $mdDialog, $mdMedia){

    // VARIABLES
    $scope.defaultImagePath = 'images/bunny.png';
    $scope.iconPrivacyPath = 'images/ic_lock_black_24px.svg';
    $scope.iconTagPath = 'images/ic_tag_black_24px.svg';    
    $scope.iconViewPath = 'images/ic_remove_red_eye_black_24px.svg';
    $scope.filterStates = ['Newest','Popular','Public','Private'];
    $scope.buttonStates = ['Public','Private','Delete'];
    $scope.userFilterState = '';
    $scope.userButtonState = '';
    var PUBLIC = 0;
    var PRIVATE = 1;
    var DELETE = 2;
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

    /* Dialog Handler */
    $scope.showConfirm = function(ev, buttonState) {
        // Check if at least 1 video is checked 
        if($scope.model.selectedVideoList.length > 0) {

            $scope.userButtonState = buttonState;
            var MESSAGE_VIDEO = 'videos';

            // Check plural for confirm dialog text
            if($scope.model.selectedVideoList.length === 1) {
               MESSAGE_VIDEO =  MESSAGE_VIDEO.substring(0, MESSAGE_VIDEO.length - 1);
            }            

            // DIALOGUE MESSAGES
            var MESSAGE_TITLE_PRIVATE = 'Make Video Private?';
            var MESSAGE_TITLE_PUBLIC = 'Make Video Public?';
            var MESSAGE_TITLE_DELETE = 'Delete Video?';
            var MESSAGE_TEXT_CONTENT_PRIVATE = 'Are you sure you want to set ' + $scope.model.selectedVideoList.length + ' ' + MESSAGE_VIDEO + ' to Private?';
            var MESSAGE_TEXT_CONTENT_PUBLIC = 'Are you sure you want to set ' + $scope.model.selectedVideoList.length + ' ' + MESSAGE_VIDEO + ' to Public?';
            var MESSAGE_TEXT_CONTENT_DELETE = 'Are you sure you want to delete ' + $scope.model.selectedVideoList.length + ' ' + MESSAGE_VIDEO + '?';

            var MESSAGE_TITLE = '';
            var MESSAGE_TEXT_CONTENT = '';

            if(buttonState === $scope.buttonStates[PRIVATE]) {
                MESSAGE_TITLE = MESSAGE_TITLE_PRIVATE;
                MESSAGE_TEXT_CONTENT = MESSAGE_TEXT_CONTENT_PRIVATE;
            } else if (buttonState === $scope.buttonStates[PUBLIC]) { 
                MESSAGE_TITLE = MESSAGE_TITLE_PUBLIC;
                MESSAGE_TEXT_CONTENT = MESSAGE_TEXT_CONTENT_PUBLIC;
            } else if (buttonState === $scope.buttonStates[DELETE]) { 
                MESSAGE_TITLE = MESSAGE_TITLE_DELETE;
                MESSAGE_TEXT_CONTENT = MESSAGE_TEXT_CONTENT_DELETE;    
            }

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title(MESSAGE_TITLE)
                  .textContent(MESSAGE_TEXT_CONTENT)
                  .ariaLabel('Confirm Dialog')
                  .targetEvent(ev)
                  .ok('Confirm')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                if(buttonState === $scope.buttonStates[PRIVATE]) {
                    for(var i=0;i<$scope.model.selectedVideoList.length;i++) {
                        servicesAPI.update($scope.model.selectedVideoList[i], {privacy: PRIVATE}).then(function() {
                            getVideoList();
                        });
                    }  
                } else if (buttonState === $scope.buttonStates[PUBLIC]) { 
                    for(var i=0;i<$scope.model.selectedVideoList.length;i++) {
                        servicesAPI.update($scope.model.selectedVideoList[i], {privacy: PUBLIC}).then(function() {
                            getVideoList();
                        });
                    }  
                } else if (buttonState === $scope.buttonStates[DELETE]) { 
                    for(var i=0;i<$scope.model.selectedVideoList.length;i++) {
                        servicesAPI.delete($scope.model.selectedVideoList[i]).then(function() {
                            getVideoList();
                        });
                    }    
                }
                // Empty video list 
                $scope.model.selectedVideoList = [];
            });
            
        } else {
            return;
        }
    };

    /* Sort video list according to filter states */
    $scope.updateFilterState = function (state) {
        $scope.userFilterState = state;
        if ($scope.userFilterState === 'Newest') {
            $scope.sortType = '-createdAt';
        } else if ($scope.userFilterState === 'Popular') {
            $scope.sortType = '-views';
        } else if ($scope.userFilterState === 'Public') {
            $scope.sortType = 'privacy';
        } else if ($scope.userFilterState === 'Private') {
            $scope.sortType = '-privacy';
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
