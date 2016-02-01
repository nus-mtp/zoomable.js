angular.module('zoomableApp').factory('servicesAPI', function($http) {
  return {
    get : function() {
      return $http.get('api/video');
    },
    getOne : function(id) {
      return $http.get('/api/video/' + id);
    },
    create : function (videoData) {
      return $http.post('api/video', videoData);
    },
    delete : function(id) {
      return $http.delete('/api/video/' + id);
    }
  }
});
