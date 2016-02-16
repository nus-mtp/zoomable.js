angular.module('zoomableApp').controller('loginController', function($scope, $state, servicesAPI, authService){

  // VARIABLES FOR NAVBAR
  $scope.profileItems = ['Settings', 'Log Out'];

  // VARIABLES FOR LOGIN FORM
  $scope.username = '';
  $scope.password = '';
  $scope.emailAddress = '';
  $scope.isCreate = false;
  $scope.errorMsg = '';

  // FUNCTIONS FOR NAVBAR
  $scope.isLoggedIn = function() {
    return authService.isAuthenticated();
  };

  $scope.showUsername = function() {
    return authService.getUsername();
  }

  $scope.setDropdownValue = function(value) {
    if (value == 'Log Out') {
      logoutUser();
    }
    // TODO for value == 'Settings'
  }

  function logoutUser() {
    servicesAPI.logout()
    .success(function(data) {
      // update user authentication info
      authService.setStatusAndUsername(false, '');
      // redirect to login page
      $state.go('login');
    })
    .error(function(data) {
      console.log('Error: ' + data);
    })
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
        // successful creation
        // update user authentication info
        authService.setStatusAndUsername(true, $scope.username);
        // redirect to dashboard page
        $state.go('dashboard');
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
        // update user authentication info
        authService.setStatusAndUsername(true, $scope.username);
        // redirect to dashboard page
        $state.go('dashboard');
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
