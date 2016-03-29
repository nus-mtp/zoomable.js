angular.module('zoomableApp').controller('loginController', function($scope, servicesAPI, $mdSidenav, $mdComponentRegistry){
  // VARIABLES
  $scope.username = '';
  $scope.password = '';
  $scope.emailAddress = '';
  $scope.forgetEmail = '';
  $scope.isCreate = false;
  $scope.errorMsg = '';
  $scope.searchQuery = '';
  $scope.location = location.pathname;
  $scope.tagList = ['architecture', 'education', 'learning', 'inspiration'];  // sample tag list

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

  /* Function to show video list of selected tag */
  $scope.setSelectedTag = function(event) {
    // remove previous selected tag if any
    $('.tag-item').removeClass('selected');
    // add selected class
    $(event.target).addClass('selected');
    // show videos with selected tag - WIP

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
          // email address already in use, reset password field
          $scope.password = '';
        }
        // update error message
        $scope.errorMsg = error;
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

  $scope.resetPassword = function() {
    if ($scope.forgetEmail) {
      // check database for user email

      // prompt invalid email if email is not found in system

      // else send verification message if email is verified
    }
  }

});
