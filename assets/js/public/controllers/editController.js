angular.module('zoomableApp').controller('editController', function($scope, $mdToast, $mdDialog, $state, servicesAPI){
	// VARIABLES
	$scope.originalVideoTitle = '';
	$scope.video = {};
	$scope.tags = [];

	$scope.init = function() {
		$scope.video = window.SAILS_LOCALS.video;
		// prevent page header from changing when title is being edited
		$scope.originalVideoTitle = $scope.video.title;
		// update tags field if it is defined
		if ($scope.video.tags !== undefined) {
			$scope.tags = $scope.video.tags;
		}
	}

	/* Save changes made to video fields */
	/* Frontend checks ensure this ftn only called when there are changes & form is valid */
	$scope.saveChanges = function() {
		// create object for editable fields
		var updatedData = {
			title: $scope.video.title,
			description: $scope.video.description,
			tags: $scope.tags,
			privacy: $scope.video.privacy
		};

		// update changes into database
		servicesAPI.update($scope.video.id, updatedData)
		.success(function() {
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
		.error(function(data, status) {
			if (status == 403) {
				// user is forbidden to perform action. Ask user to sign in again using toast.
				var toast = $mdToast.simple()
				.content('Please login to make changes.')
				.action('Login').highlightAction(true)
				.hideDelay(false)
				.position('top right')
				.parent(document.getElementById('toast-area'));

				$mdToast.show(toast).then(function(response) {
					if (response == 'ok') {
						// redirect to dashboard page
						window.location = '/';
					}
				});
			}
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
				window.location = '/';
			});
		}
		else {
			// just redirect to dashboard page if no changes made
			window.location = '/';
		}
	};

	/* Update video privacy field */
	$scope.updatePrivacy = function(privacy) {
		$scope.video.privacy = privacy;

		// set form to dirty to enable save button
		$scope.videoForm.$setDirty();
	}

});
