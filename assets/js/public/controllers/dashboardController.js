angular.module('zoomableApp').controller('dashboardController', function($scope){

    // MESSAGES
    $scope.MESSAGE_MY_VIDEOS = 'My Videos';
    $scope.MESSAGE_VIEWS = 'Views';
    $scope.MESSAGE_COUNT_ZERO = '0';
    $scope.MESSAGE_ERROR_NO_VIDEO = 'No Video Yet';

    // VARIABLES
    $scope.iconPrivacyPath = 'images/ic_lock_black_24px.svg';
    $scope.iconTagPath = 'images/ic_tag_black_24px.svg';    
    $scope.iconViewPath = 'images/ic_remove_red_eye_black_24px.svg';
    $scope.filterStates = ['Newest','Popular','Public','Private'];
    $scope.buttonStates = ['Private','Public','Delete'];
    $scope.userFilterState = '';
    $scope.userButtonState = '';

    $scope.model = {
        selectedVideoList : []
    }

    var imagePath = 'images/bunny.png';

    // $scope.videoList = [];
    $scope.videoList = [{
      id : 1,
      thumbnail : imagePath,
      title: 'AY2015/16 CS3283 Lecture 4 Webcast',
      createdAt: '2016-01-26T09:58:49.913Z',
      updatedAt: '2016-01-26T09:58:49.913Z',
      privacy: 1,
      shares : 0,
      tags: 'architecture, system',
      views: 0
    },{
      id : 2,
      thumbnail : imagePath,
      title: 'AY2015/16 CS3283 Lecture 4 Webcast',
      createdAt: '2016-01-26T09:58:49.913Z',
      updatedAt: '2016-01-26T09:58:49.913Z',
      privacy: 0,
      shares : 0,
      tags: '',
      views: 2
    },{
      id : 3,
      thumbnail : imagePath,
      title: 'AY2015/16 CS3283 Lecture 4 Webcast',
      createdAt: '2016-01-26T09:58:49.913Z',
      updatedAt: '2016-01-26T09:58:49.913Z',
      privacy: 1,
      shares : 0,
      tags: 'architecture, system',
      views: 3    
    },{
      id : 4,
      thumbnail : imagePath,
      title: 'AY2015/16 CS3283 Lecture 4 Webcast',
      createdAt: '2016-01-26T09:58:49.913Z',
      updatedAt: '2016-01-26T09:58:49.913Z',
      privacy: 0,
      shares : 0,
      tags: 'architecture, system',
      views: 4    
    }];

    /* BUTTON HANDLER */
    $scope.toggleButton = function(buttonId) {
        $scope.userButtonState = buttonId;
    };

    /* CHECKBOX HANDLER */
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

});
