describe('loginController', function(){
  var scope; // use this scope in our tests
  var sideNavMock = jasmine.createSpy();

  // mock Application to allow us to inject our own dependencies
  beforeEach(angular.mock.module('zoomableApp'));

  // mock the controller for the same reason and include $rootScope and $controller
  beforeEach(angular.mock.inject(function($rootScope, $controller){
    // create an empty scope
    scope = $rootScope.$new();
    // create side nav
    $mdSidenav = jasmine.createSpy().and.callFake(function() {
      return {toggle: sideNavMock};
    });
    // declare the controller and inject our empty scope with side nav
    $controller('loginController', {
      $scope: scope,
      $mdSidenav : $mdSidenav
    });
  }));

  // tests start here
  describe('#isVideoList', function() {
    it('should return true if location is at dashboard page', function() {
      scope.location = '/';

      expect(scope.isVideoList()).toEqual(true);
    });
    it('should return false if location is not at dashboard page', function() {
      scope.location = '/edit';

      expect(scope.isVideoList()).toEqual(false);
    });
  });

  describe('#toggleLeftMenu', function() {
    it('should toggle the left menu when called', function() {
      scope.toggleLeftMenu();
      expect(sideNavMock).toHaveBeenCalled();
    });
  });
});
