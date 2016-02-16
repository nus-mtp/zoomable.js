angular.module('zoomableApp').controller('loginController', function($scope){
    $scope.user = true;  // set to true for now

    /* FOR NAVBAR */
    $scope.username = "USERNAME";     // TO BE EDITED WHEN LINK TO DB
    $scope.profileItems = ['Settings', 'Log Out'];

    /* FOR LOGIN */
    $scope.greeting = "Welcome to Zoomable";
});
