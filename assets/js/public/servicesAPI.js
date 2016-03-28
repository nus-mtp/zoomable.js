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
    getVideoStat : function(id) {
      return $http.get('/api/video/getStat/' + id);
    },
    getVideoStats : function() {
      return $http.get('/api/video/getStats');
    },
    getUploadProgress : function(id) {
      return $http.post('/api/video/isComplete', id);
    },
    delete : function(id) {
      return $http.delete('/api/video/' + id);
    },
    deleteAll : function(ids) {
      return $http.delete('/api/video', {data : ids});
    },
    update : function(id, videoData) {
      return $http.put('/api/video/' + id, videoData);
    },
    login : function(accountData) {
      return $http.post('/api/user/login', accountData);
    },
    getUserAccountDate : function() {
      return $http.get('/api/user/getAccountDate');
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
          }).then(function (res) {
            resolve(res);
          });
        });
      });
    }
  }
});
