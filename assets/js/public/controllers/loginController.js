angular.module('zoomableApp').controller('loginController', function($scope, servicesAPI, $mdSidenav, $mdComponentRegistry){
  // VARIABLES
  $scope.username = '';
  $scope.password = '';
  $scope.emailAddress = '';
  $scope.isCreate = false;
  $scope.errorMsg = '';
  $scope.searchQuery = '';
  $scope.location = location.pathname;

  // FUNCTIONS FOR NAVBAR

  /* Function to control showing of search input in navbar */
  $scope.isVideoList = function() {
    if ($scope.location == '/') {
      return true;
    }
    else {
      return false;
    }
  };

  /* Function to toggle left menu in dashboardController */
  $scope.toggleLeftMenu = function() {
    $mdSidenav('left').toggle();
  };

  /* Function to show the correct page on button selection */
  $scope.showPage = function(event) {
    // remove previous selected class
    $('.selection-btn').removeClass('selected');

    if (event.target.id === 'showVideoBtn') {
      // show homepage (video list)
      window.location = '/';
    }
    else if (event.target.id === 'showStatBtn') {
      // show statistic page
      window.location = '/statistics';
    }

    // toggle the menu
    $scope.toggleLeftMenu();
  };

  /* Deferred lookup of component instance using $component registry */
  // Reference from http://luxiyalu.com/angular-material-no-instance-found-for-handle-left/
  $mdComponentRegistry.when('left').then(function(leftSidenav){
    /* Function to watch toggling of left menu to set appropriate classes for styling */
    $scope.$watch(function () {
      return leftSidenav.isOpen();
    },
    function (currValue, prevValue) {
      if (currValue === false && prevValue === false) {
        // don't set classes on initialization
        return;
      }
      else {
        // set classes
        setClassesForLeftMenu();
      }
    });
  });

  /* Function to call search in dashboardController */
  $scope.searchVideoList = function() {
    $scope.$emit('searchEmit', $scope.searchQuery);
  };

  function setClassesForLeftMenu() {
    if ($('#menuBtn').hasClass('opened')) {
      // remove background color on menu btn
      $('#menuBtn').removeClass('opened');
      // make body scrollable
      $('body').removeClass('no-scroll');
    }
    else {
      // add background color on menu bar
      $('#menuBtn').addClass('opened');
      // make body not scrollable
      $('body').addClass('no-scroll');
    }
  }

  // FUNCTIONS FOR LOGIN FORM

  /* Function to sign in or create new account */
  $scope.submitForm = function() {
    if ($scope.isCreate) {
      if ($scope.username.length < 6 || $scope.password.length < 6) {
        // prompt username or password too short
        $scope.errorMsg = 'Username and password must be at least 6 characters long.';
        return;
      }

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
	    .error(function(error, status) {
        if (status === 409) {
          // email address already in use, update error message
          $scope.errorMsg = error;
        }
        else if (status === 400) {
          if (error === 'LengthNotSatisfied') {
            // username or password too short
            $scope.errorMsg = 'Username and password must be at least 6 characters long.';
          }
          else {
            // username already in use, update error message
            $scope.errorMsg = 'Username is already taken by another user.';
          }
        }

        //reset password field
        $scope.password = '';
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
	    .error(function(error, status) {
        if (status === 401) {
          // unsuccessful login, initialise password field
          $scope.password = '';
        }
        // update error message
        $scope.errorMsg = error;
	    });
    }
  };

  /* Function to check for empty fields in form */
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
  };

});
