angular.module('zoomableApp').controller('editController', function($scope, $stateParams, servicesAPI){
	// VARIABLES
	$scope.video_id = $stateParams.videoId;

	/* Get video object by video id */
	servicesAPI.getOne($scope.video_id)
	.success(function(data) {
		$scope.video = data;
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});

});
