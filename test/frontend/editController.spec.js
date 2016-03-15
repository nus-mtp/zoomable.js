describe('editController', function(){
  var scope; // use this scope in our tests

  // mock Application to allow us to inject our own dependencies
  beforeEach(angular.mock.module('zoomableApp'));

  // mock the controller for the same reason and include $rootScope and $controller
  beforeEach(angular.mock.inject(function($rootScope, $controller){
    // create an empty scope
    scope = $rootScope.$new();
    // declare the controller and inject our empty scope
    $controller('editController', {$scope: scope});
  }));

  // tests start here
  describe('#setPrivacy', function() {
    it('sets privacy to public and updates form state', function() {
      scope.videoForm = {
        $setDirty: jasmine.createSpy('$setDirty')
      };
      scope.video.privacy = 0;

      scope.updatePrivacy(1);
      expect(scope.video.privacy).toEqual(1);
      expect(scope.videoForm.$setDirty).toHaveBeenCalled();
    });
    it('sets privacy to private and updates form state', function() {
      scope.videoForm = {
        $setDirty: jasmine.createSpy('$setDirty')
      };
      scope.video.privacy = 1;

      scope.updatePrivacy(0);
      expect(scope.video.privacy).toEqual(0);
      expect(scope.videoForm.$setDirty).toHaveBeenCalled();
    });
  });
});
