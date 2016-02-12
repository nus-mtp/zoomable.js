angular.module('zoomableApp').controller('editController', function($scope, $stateParams, servicesAPI){

	// VARIABLES
	$scope.defaultImagePath = 'images/bunny.png';
	$scope.video_id = $stateParams.videoId;
	$scope.originalVideoTitle = '';

	/* Get video object by video id */
	servicesAPI.getOne($scope.video_id)
	.success(function(data) {
		$scope.video = data;
		// prevent page header from changing when title is being edited
		$scope.originalVideoTitle = $scope.video.title;
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});

	/* Save changes made to video fields */
	/* Frontend checks ensure this ftn only called when there are changes & form is valid */
	$scope.saveChanges = function() {
		// create object for editable fields
		var updatedData = {
			title: $scope.video.title,
			description: $scope.video.description,
			//tags: $scope.video.tags,
			privacy: $scope.video.privacy
		};

		// update changes into database
		servicesAPI.update($scope.video.id, updatedData)
	    .success(function(data) {
				// update page header title with new title
				$scope.originalVideoTitle = $scope.video.title;

				// set form back to clean state to disable save button
				$scope.videoForm.$setPristine();
	    })
	    .error(function(data) {
	      console.log('Error: ' + data);
	    });
	};

	/* Copy embed link to system clipboard */
	$scope.copyEmbedLink = function(link) {
		console.log(link);
		// TO BE IMPLEMENTED
	}

	/* Update video privacy field */
	$scope.updatePrivacy = function(privacy) {
		$scope.video.privacy = privacy;

		// set form to dirty to enable save button
		$scope.videoForm.$setDirty();
	}

});
