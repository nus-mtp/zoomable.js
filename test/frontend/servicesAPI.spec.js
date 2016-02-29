describe('servicesAPI', function(){

  // mock Application to allow us to inject our own dependencies
  beforeEach(angular.mock.module('zoomableApp'));

  describe('#get', function() {
    beforeEach(inject(function($controller, $rootScope, $httpBackend) {
      $scope = $rootScope.$new();
      $httpBackend.whenGET('api/video').respond({ videos: 'and stuff' });
      //expect a get request to "api/video"
      $httpBackend.expectGET('api/video');
      //get video is used in dashboardController
      dashboardController = $controller('dashboardController', { $scope: $scope });
      $httpBackend.flush();
    }));

    it('should get a list of videos', function() {
      // this API call is used in dashboardController getVideoList() function
      expect($scope.videoList).toEqual({
        videos: 'and stuff'
      });
    });
  });

});
