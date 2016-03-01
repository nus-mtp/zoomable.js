angular.module('zoomableApp').controller('loginController', function($scope, $state, servicesAPI){
  // VARIABLES
  $scope.username = '';
  $scope.password = '';
  $scope.emailAddress = '';
  $scope.isCreate = false;
  $scope.errorMsg = '';
  $scope.searchQuery = '';

  // FUNCTIONS FOR NAVBAR

  /* Function to control showing of search input in navbar */
  $scope.isVideoList = function() {
    if (location.pathname == '/') {
      return true;
    }
    else {
      return false;
    }
  }

  /* Function to call search in dashboardController */
  $scope.searchVideoList = function() {
    $scope.$emit('searchEmit', $scope.searchQuery);
  }

  // FUNCTIONS FOR LOGIN FORM
  $scope.submitForm = function() {
    if ($scope.isCreate) {
      var accountData = {
        username: $scope.username,
        password: $scope.password,
        email: $scope.emailAddress
      }

      // create a new account for new user
			servicesAPI.createAccount(accountData)
	    .success(function(data) {
        // redirect to dashboard page
        window.location = '/';
	    })
	    .error(function(data) {
	      console.log('Error: ' + data);
        // add prompt if email is not unique
	    });
    }
    else {
      var accountData = {
          username: $scope.username,
          password: $scope.password
      }

      // check if user entered correct username and password
      servicesAPI.login(accountData)
	    .success(function(data) {
        // redirect to dashboard page
        window.location = '/';
	    })
	    .error(function(data) {
	      console.log('Error: ' + data);
        // unsuccessful login, update error message and initialise password field
        $scope.errorMsg = "Incorrect username/password. Please try again.";
        $scope.password = '';
	    });
    }
  };

  $scope.hasEmptyFields = function() {
    if ($scope.isCreate) {
      // enable submit only if all fields are entered
      if ($scope.emailAddress && $scope.username && $scope.password) {
        return false;
      }
    }
    else {
      // enable submit only if all fields are entered
      if ($scope.username && $scope.password) {
        return false;
      }
    }
    return true;
  }

});
