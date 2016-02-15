angular.module('zoomableApp').controller('editController', function($scope, $stateParams, $mdToast, $mdDialog, $state, servicesAPI){

	// VARIABLES
	$scope.defaultImagePath = 'images/bunny.png';
	$scope.video_id = $stateParams.videoId;
	$scope.originalVideoTitle = '';
	$scope.tags = [];

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

				// show toast if changes saved successfully
				var toast = $mdToast.simple()
					.content('Changes Saved!')
					.action('OK').highlightAction(true)
					.hideDelay(1500)
					.position('top right')
					.parent(document.getElementById('toast-area'));

				$mdToast.show(toast);

				// set form back to clean state to disable save button
				$scope.videoForm.$setPristine();
	    })
	    .error(function(data) {
	      console.log('Error: ' + data);
	    });
	};

	/* Show dialog when user click cancel when changes made */
	$scope.showConfirm = function(ev) {
		if ($scope.videoForm.$dirty) {
			// Appending dialog to document.bod
	    var confirm = $mdDialog.confirm()
	      .title('Are you sure you want to leave this page?')
	      .textContent('You have unsaved changes. Your changes will not be saved if you leave this page.')
	      .ariaLabel('Confirm Navigation')
	      .targetEvent(ev)
	      .ok('Stay on this page')
	      .cancel('Leave this page');
	    $mdDialog.show(confirm).then(function() {
				// if user stay on page, do nothing
			}, function() {
				// if user leave page, redirect to dashboard page
				$state.go('dashboard');
			});
		}
		else {
			// just redirect to dashboard page if no changes made
			$state.go('dashboard');
		}
  };

	/* Update video privacy field */
	$scope.updatePrivacy = function(privacy) {
		$scope.video.privacy = privacy;

		// set form to dirty to enable save button
		$scope.videoForm.$setDirty();
	}

});
