angular.module('zoomableApp').factory('servicesAPI', function($http, $q, Upload, $timeout) {
  return {
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
    createAccount : function(accountData) {
      return $http.post('/api/user/signup', accountData);
    },
    login : function(accountData) {
      return $http.post('/api/user/login', accountData);
    },
    upload : function (file) {
      return $q(function(resolve, reject) {
        setTimeout(function() {
          Upload.upload({
            url : '/api/video',
            data : {
                title : file.name,
                videoDir : '',
                thumbnailDir : '',
                file: file
            }
          })
          .then(function (response) {
              $timeout(function() {
              resolve(response);
              });
          }, function (evt) {
              resolve(file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total)));
          });
        });
      });
    }
    }
});
