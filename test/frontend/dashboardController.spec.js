describe('dashboardController', function(){
  var scope; // use this scope in our tests
  // mock video objects
  var vid1 = {title: 'Mission Impossible', videoDir: '/video/1', thumbnailDir: '/video/1/a.jpg'};
  var vid2 = {title: 'Mission Impossible', videoDir: '/video/1', thumbnailDir: '/video/1/a.jpg'};

  // mock Application to allow us to inject our own dependencies
  beforeEach(angular.mock.module('zoomableApp'));

  // mock the controller for the same reason and include $rootScope and $controller
  beforeEach(angular.mock.inject(function($rootScope, $controller){
    // create an empty scope
    scope = $rootScope.$new();
    // declare the controller and inject our empty scope
    $controller('dashboardController', {$scope: scope});
  }));

  describe('#checkboxHandler', function() {
    it('adds all videos to selectedVideoList', function() {
      // set videoList to have 2 videos
      scope.videoList = [vid1,vid2];
      expect(scope.videoList.length).toEqual(2);
      // set selected video to 0
      scope.model.selectedVideoList = [];
      expect(scope.model.selectedVideoList.length).toEqual(0);

      // set check all videos to be true
      scope.master = true;
      // call function to select all videos
      scope.isSelectAll();

      // should set all videos selected to be true
      expect(scope.videoList[0].selected).toBe(true);
      expect(scope.videoList[1].selected).toBe(true);
      expect(scope.master).toBe(true);
      // should add all videos to selectedVideoList
      expect(scope.model.selectedVideoList.length).toEqual(2);
    });
    it('adds one video to selectedVideoList', function() {
      // set check all to false
      scope.master = false;
      // set selected video to 0
      scope.model.selectedVideoList = [];
      // set total video in video list to 1
      scope.videoList = [vid1];
      // set current video
      scope.video = vid1;

      // set video selected to be true
      scope.video.selected = true;
      // call function to select video
      scope.isLabelChecked();

      // should set video selected in videolist to be true
      expect(scope.videoList[0].selected).toBe(true);
      // should set check all to true since total video is 1
      expect(scope.master).toBe(true);
      // should add 1 video in selectedVideoList
      expect(scope.model.selectedVideoList.length).toEqual(1);
    });
    it('remove all videos from selectedVideoList', function() {
      // set videoList to 2 videos
      scope.videoList = [vid1,vid2];
      expect(scope.videoList.length).toEqual(2);
      // set selected video to 2 videos
      scope.model.selectedVideoList = [vid1,vid2];
      expect(scope.model.selectedVideoList.length).toEqual(2);

      // set check all video to false
      scope.master = false;
      // call function to unselect all videos
      scope.isSelectAll();

      // should set all videos to be unselected
      expect(scope.videoList[0].selected).toBe(false);
      expect(scope.videoList[1].selected).toBe(false);
      // should remove all videos from selectedVideoList
      expect(scope.model.selectedVideoList.length).toEqual(0);
    });
    it('remove one video from selectedVideoList', function() {
      // set total video in video list to 2
      scope.videoList = [vid1,vid2];
      // set selectedVideoList to 2
      scope.model.selectedVideoList = [vid1,vid2];
      // set current video
      scope.video = vid1;

      // call function to select video
      scope.video.selected = false;
      scope.isLabelChecked();

      // should remove 1 video from selectedVideoList
      expect(scope.model.selectedVideoList.length).toEqual(1);
      // should set check all to false since remove 1 video
      expect(scope.master).toBe(false);
    });
  });

  describe('#updateSortandFilterState', function() {
    it('sets sortType to latest', function() {
      // set sortType to undefined
      expect(scope.sortType).toEqual(undefined);
      // mock state to be latest
      var state = 'Latest';
      // call function to update sortType
      scope.updateSortState(state);
      // should update sortType
      expect(scope.sortType).toEqual('-createdAt');
    });
    it('sets sortType to most viewed', function() {
      // set sortType to undefined
      expect(scope.sortType).toEqual(undefined);
      // mock state to be latest
      var state = 'Most Viewed';
      // call function to update sortType
      scope.updateSortState(state);
      // should update sortType
      expect(scope.sortType).toEqual('-views');
    });
    it('sets filterType to public', function() {
      // set filterType to undefined
      expect(scope.filterType).toEqual(undefined);
      // mock state to be latest
      var state = 'Public';
      // call function to update filterType
      scope.updateFilterState(state);
      // should update filterType
      expect(scope.filterType).toEqual({ privacy : 1 });
    });
    it('sets filterType to private', function() {
      // set filterType to undefined
      expect(scope.filterType).toEqual(undefined);
      // mock state to be latest
      var state = 'Private';
      // call function to update filterType
      scope.updateFilterState(state);
      // should update filterType
      expect(scope.filterType).toEqual({ privacy : 0 });
    });
  });

  describe('#getVideoList', function() {
    beforeEach(inject(function($controller, $rootScope, $httpBackend) {
      scope = $rootScope.$new();
      $httpBackend.whenGET('api/video').respond(vid1);
      // declare the controller and inject our empty scope
      $controller('dashboardController', {$scope: scope});
      $httpBackend.flush();
    }));
    it('get a list of videos from mock api', function() {
      expect(scope.videoList).toEqual(vid1);
    });
  });

});
