angular.module('zoomableApp').factory('servicesAPI', function($http, $q, Upload, $timeout) {
  return {
    createVideo : function(video) {
      return $http.post('/api/video', video);
    },
    createAccount : function(accountData) {
      return $http.post('/api/user/signup', accountData);
    },
    get : function() {
      return $http.get('api/video');
    },
    getOne : function(id) {
      return $http.get('/api/video/' + id);
    },
    delete : function(id) {
      return $http.delete('/api/video/' + id);
    },
    update : function(id, videoData) {
      return $http.put('/api/video/' + id, videoData);
    },
    login : function(accountData) {
      return $http.post('/api/user/login', accountData);
    },
    upload : function (file) {
      return $q(function(resolve, reject) {
        setTimeout(function() {
          Upload.upload({
            url : '/api/video/upload',
            data : {
                id : file.id,
                video : file
            }
          });
        });
      });
    }
  }
});
