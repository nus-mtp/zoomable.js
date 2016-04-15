describe('editController', function(){
  var scope; // use this scope in our tests
  var video = { // mock video object
    title: 'Zootopia',
    tags: ['animals'],
    description: 'Part 1',
    privacy: 0,
    id: 1
  };

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
  describe('#init', function() {
    beforeEach(function() {
      // mock the sails locals video object
      window.SAILS_LOCALS = {
        video: video
      };
      scope.init();
    });

    it('should initialises a video object on scope.video', function() {
      expect(scope.video).toEqual(window.SAILS_LOCALS.video);
    });

    it('should set scope.originalVideoTitle to have the same title', function() {
      expect(scope.originalVideoTitle).toEqual(window.SAILS_LOCALS.video.title);
    });

    it('should set scope.tags to have the same tags if it is defined', function() {
      expect(scope.tags).toEqual(window.SAILS_LOCALS.video.tags);
    });
  });

  describe('#init', function() {
    var videoCopy = JSON.parse(JSON.stringify(video)); // clone the video obj to prevent original object from being mutated

    it('should set scope.tags to empty array if no tag is defined', function() {
      delete videoCopy.tags;
      // mock the sails locals video object
      window.SAILS_LOCALS = {
        video: videoCopy
      };
      scope.init();
      expect(scope.tags.length).toBe(0);
    });
  });

  describe('#setPrivacy', function() {
    beforeEach(function() {
      scope.videoForm = {
        $setDirty: jasmine.createSpy('$setDirty')
      };
    });

    it('sets privacy to public and updates form state', function() {
      scope.video.privacy = 0;

      scope.updatePrivacy(1);
      expect(scope.video.privacy).toEqual(1);
      expect(scope.videoForm.$setDirty).toHaveBeenCalled();
    });
    it('sets privacy to private and updates form state', function() {
      scope.video.privacy = 1;

      scope.updatePrivacy(0);
      expect(scope.video.privacy).toEqual(0);
      expect(scope.videoForm.$setDirty).toHaveBeenCalled();
    });
  });
});
