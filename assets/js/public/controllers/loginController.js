angular.module('zoomableApp').controller('loginController', function($scope, $state, servicesAPI, $mdSidenav){
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
      // add selected class
      $('#showVideoBtn').addClass('selected');
      // show video page - WIP
    }
    else if (event.target.id === 'showStatBtn') {
      // add selected class
      $('#showStatBtn').addClass('selected');
      // show statistic page - WIP
    }

    // toggle the menu
    $scope.toggleLeftMenu();
  };

  /* Function to watch toggling of left menu to set appropriate classes for styling */
  $scope.$watch(function () {
    return $mdSidenav('left').isOpen();
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
