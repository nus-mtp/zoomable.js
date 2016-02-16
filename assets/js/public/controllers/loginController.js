angular.module('zoomableApp').controller('loginController', function($scope, $state, servicesAPI){

  /* FOR NAVBAR */
  $scope.profileItems = ['Settings', 'Log Out'];

  /* FOR LOGIN FORM */
  $scope.username = '';
  $scope.password = '';
  $scope.email = '';
  $scope.isCreate = false;
  $scope.errorMsg = '';

  $scope.submitForm = function() {
    if ($scope.isCreate) {
      var accountData = {
        username: $scope.username,
        password: $scope.password,
        email: $scope.email
      }

      // create a new account for new user
			servicesAPI.createAccount(accountData)
	    .success(function(data) {
        // successful creation
        console.log('new account is created');
				//console.log(data);
        //$state.go('dashboard');
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
        // successful login
        console.log('user is logged in');
        //console.log(data);
        //$state.go('dashboard');
	    })
	    .error(function(data) {
	      console.log('Error: ' + data);
        $scope.errorMsg = "Incorrect username/password. Please try again.";
        $scope.password = '';
	    });
    }
  };

});
