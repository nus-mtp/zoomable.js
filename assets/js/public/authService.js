angular.module('zoomableApp').factory('authService', function() {
  var userInfo = {
    isLogged: false,
    username: ''
  };
  //return userInfo;

  return {
    setStatusAndUsername : function(status, username) {
      userInfo.isLogged = status;
      userInfo.username = username
    },
    getUsername : function () {
      return userInfo.username;    //we need some way to access actual variable value
    },
    isAuthenticated : function() {
      return userInfo.isLogged;
    }
  }
});
