// The list of MPDs are hardcoded here for now, will eventually run a script to detect the relevant MPDs to retrieve
var mpdList = [];
for(var i = 1; i <= 3; i++) {
	for(var j = 1; j <= 4; j++) {
		mpdList.push('/../../../../../../upload/vid/7/7_mpd_R' + i + 'C' + j + '.mpd');
	}
}
// The audio file for the video
mpdList.push('/../../../../../../upload/vid/7/7.mp3');

// On 'DOMContentLoaded', create a master Player object and initialize
var vidCount = 1;
document.addEventListener('DOMContentLoaded', function() {
	canvas_obj = document.getElementById('canvas');
	var loadPlayers = new Player(canvas_obj, mpdList);
	loadPlayers.initShakaPlayers();
	loadPlayers.init();
}, false);

var Player = function(canvas, mpd_list) {

	var VID_WIDTH = canvas.width / 4;
	var VID_HEIGHT = canvas.height / 3;
	var NUM_SLAVES = 12;
	var NUM_ROWS = 3;
	var NUM_COLS = 4;

	this.time = null;
	this.timeArr = [];  // Array of current time for each video object
	this.duration = null;

	this.slaves = []; //array of slave objects
	this.audio; // The audio object from the HTML

	// To store the pause state of each video's pause status
	this.slavePauseArr = [];
	this.paused = true;

	// To determine if the overall state of the players have ended
	this.ended = false;
	// To store the truthy value of whether the players' videos have ended
	this.slaveEndArr = [];

	this.canvas = canvas;
	this.ctx = this.canvas.getContext('2d');
	this.scaleFactor = 1.1;
	this.zoomFactor = 1;
	this.dimensions = { cw:canvas.width, ch:canvas.height };
	this.last;
	this.dragStart;
	this.dragged;
	this.mouseactions;
	this.scroll;
	this.controls;
	this.volume;
	this.seek;
	this.zoom;
	this.transforms;
	this.util;

	// Initialization of all the Shaka players and the video elements
	this.initShakaPlayers = function() {
		init_players(this, canvas, mpd_list);
	};

	// Initialization will only be called once during the creation of the Player object the first time
	this.init = function() {

		this.duration = getVideoDuration(this); // To intialize the video duration
		this.volume = new Volume(this); // To initialize the volume of the audio file
		this.volume.setVolume(0.5); //set default vol of video

		this.scroll = new Scroll(this); // NOT WORKING YET
		this.zoom = new Zoom(this); // NOT WORKING YET
		this.controls = new Controls(this);
		this.transforms = new Transforms(this);
		this.seek = new Seek(this);
		this.transforms = new Transforms(this);
		this.util = new Util(this);
		//this.transforms.draw();
		this.last = { x: canvas.width/2, y: canvas.height/2 };

		this.mouseactions = new MouseActions(this);
	};

	var MouseActions = function(player) {
		// To listen for the 'mousedown' event on the canvas
		player.canvas.addEventListener('mousedown',function(event) {
			player.mouseactions.mouseDown(event);
		},false);
		// To listen for the 'mousemove' event on the canvas
		player.canvas.addEventListener('mousemove',function(event) {
			player.mouseactions.mouseMove(event);
		},false);
		// To listen for the 'mouseup' event on the canvas
		player.canvas.addEventListener('mouseup',function(event) {
			player.mouseactions.mouseUp(event);
		},false);


		this.mouseDown = function(evt){
			document.body.style.mozUserSelect =
			document.body.style.webkitUserSelect =
			document.body.style.userSelect = 'none';
			player.last.x = evt.offsetX || (evt.pageX - player.canvas.offsetLeft);
			player.last.y = evt.offsetY || (evt.pageY - player.canvas.offsetTop);
			player.dragStart = player.ctx.transformedPoint(player.last.x,player.last.y);
			player.dragged = false;
		};
		this.mouseMove = function(evt){
			player.last.x = evt.offsetX || (evt.pageX - player.canvas.offsetLeft);
			player.last.y = evt.offsetY || (evt.pageY - player.canvas.offsetTop);
			player.dragged = true;
			if (player.dragStart){
				player.transforms.outerTranslate();
			}
		};
		this.mouseUp = function(evt){
			player.dragStart = null;
		}
	};

	var Scroll = function(player) {
		canvas.addEventListener('DOMMouseScroll',function(event) { player.scroll.handle(event); },false);
		canvas.addEventListener('mousewheel',function(event) { player.scroll.handle(event); },false);

		this.handle = function(evt){
			var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
			if (delta) {
				//updateSliderUI(zoomCtrl);
				player.zoom.zoom(delta, player.last.x, player.last.y);
				player.controls.updateZoomUI();
			}
			return evt.preventDefault() && false;
		}
	};

	var Controls = function(player) {

		/* binds to UI and adds listeners for controls*/
		this.playPauseBtn = document.getElementById('playPauseBtn');
		this.uiControls = document.getElementById('uiControls');
		this.currentTimeTxt = document.getElementById('currentTimeTxt');
		this.totalTimeTxt = document.getElementById('totalTimeTxt');
		this.seekCtrl = document.getElementById('seekCtrl');
		this.volumeBtn = document.getElementById('volumeBtn');
		this.volumeCtrl = document.getElementById('volumeCtrl');
		this.zoomOutBtn = document.getElementById('zoomOutBtn');
		this.zoomCtrl = document.getElementById('zoomCtrl');
		this.zoomInBtn = document.getElementById('zoomInBtn');

		this.playPauseBtn.addEventListener('click',function(){
			player.controls.playPauseVideo();
		},false);

		// This is to check and update the MUTE button on the UI controls
		// if it was clicked
		this.volumeBtn.addEventListener('click', function() {
			player.volume.toggleMuteState(event);
			player.controls.updateSliderUI(player.controls.volumeCtrl);
		},false);

		// This is to check and update the VOLUME controls on the UI controls
		// if it was clicked
		this.volumeCtrl.addEventListener('change',function(){
			player.volume.volumeAdjust(); // WHAT IS THIS?!?!?!?!
			player.controls.updateSliderUI(player.controls.volumeCtrl);
		},false);

		// This is to check and update the UI controls if the VOLUME was
		// changed on Shaka player's end
		/*
		player.video.addEventListener('volumechange',function(){
		player.controls.updateSliderUI(player.controls.volumeCtrl);
		},false);
		*/

		// This is to check and update the UI controls when the 'mousemove'
		// event triggers
		this.volumeCtrl.addEventListener('mousemove',function(){
			player.controls.updateSliderUI(player.controls.volumeCtrl);
		},false);

		// This is to check and update the UI controls when the 'Zoom In'
		// button is clicked
		this.zoomInBtn.addEventListener('click',function(){
			player.zoom.in();
		},false);

		// This is to check and update the UI controls when the 'Zoom Out'
		// button is clicked
		this.zoomOutBtn.addEventListener('click',function(){
			player.zoom.out();
		},false);

		// This is to check and update the UI controls when the 'change' event
		// occurs on the zoom controls
		this.zoomCtrl.addEventListener('change',function(){
			player.zoom.adjust();
		},false);

		// This is to check and update the UI controls when the 'mousemove'
		// event occurs
		this.zoomCtrl.addEventListener('mousemove',function(){
			player.controls.updateSliderUI(player.controls.zoomCtrl);
		},false);

		/* Play or pause the video */
		this.playPauseVideo = function() {
			// If the player is paused, i.e. player.paused == true, play all the videos
			if (player.paused) {
				player.util.forAllSlaves(player.controls.playVideo);
				// Set the slavePauseArr to all false
				player.util.setPauseArr(false);
				player.paused = false;
				syncPauseState(player);
				// Change the UI controls to reflect the new play state
				player.controls.changeToPlayState();
				// Play the audio file
				player.audio.play();
			}
			// Else if the video has ended, i.e. player.ended == true,
			// Set the seek time back to 0, play all the videos
			else if (player.ended) {
				player.util.forAllSlaves(player.controls.restartVideo);
				// Set the slavePauseArr to all false
				player.util.setPauseArr(false);
				// Set the player's ended boolean value to false
				player.ended = false;
				// Set the player's pause state to false
				player.paused = false;
				syncPauseState(player);
				// Change the UI controls to reflect the new play state
				player.controls.changeToPlayState();
				// Play the audio file
				player.audio.play();

			}
			// Else if the player is playing, i.e. player.paused == false, pause all the videos
			else {
				player.util.forAllSlaves(player.controls.pauseVideo);
				player.util.setPauseArr(true);
				player.paused = true;
				syncPauseState(player);
				// Change the UI controls to reflect the new pause state
				player.controls.changeToPauseState();
				// Pause the audio file
				player.audio.pause();
			}
		}

		this.playVideo = function(slaveObj) {
			slaveObj.video.play();
		}

		this.pauseVideo = function(slaveObj) {
			slaveObj.video.pause();
		}

		this.restartVideo = function(slaveObj) {
			slaveObj.video.currentTime = 0;
		}

		/* Updates icon to "play" button during pause state, show UI controls bar */
		this.changeToPauseState = function() {
			this.playPauseBtn.className = 'play';
			this.uiControls.className = '';
		}

		/* Updates icon to "pause" button during play state, hide UI controls bar */
		this.changeToPlayState = function() {
			this.playPauseBtn.className = 'pause';
			this.uiControls.className = 'hideOnHover';
		}

		/* Updates icon to "replay" button after video has ended, show UI controls bar */
		this.changeToReplayState = function() {
			this.playPauseBtn.className = 'replay';
			this.uiControls.className = '';
		}

		/* Retrieve total duration of video and update total time text */
		this.getVideoLength = function() {
			var convertedTotalTime = player.util.convertSecondsToHMS(player.duration);
			this.totalTimeTxt.innerHTML = convertedTotalTime;
		};

		/* Convert and update current time text */
		this.updateCurrentTimeText = function(time) {
			var convertedTime = player.util.convertSecondsToHMS(time);
			this.currentTimeTxt.innerHTML = convertedTime;
		};

		/* Update zoom control UI */
		this.updateZoomUI = function() {
			this.zoomCtrl.value = player.util.convertScaleToPercent(player.transforms.xform.a);
			this.updateSliderUI(this.zoomCtrl);
		};

		/* Update slider color when slider value changes - for zoomCtrl/volumeCtrl */
		this.updateSliderUI = function(element) {
			var gradient = ['to right'];
			gradient.push('#ccc ' + (element.value * 100) + '%');
			gradient.push('rgba(255, 255, 255, 0.3) ' + (element.value * 100) + '%');
			gradient.push('rgba(255, 255, 255, 0.3) 100%');
			element.style.background = 'linear-gradient(' + gradient.join(',') + ')';
		};
	}

	var Volume = function(player){
		this.previousVolume = {
			state: 'low',
			value: document.getElementById('aud_file').volume
		};

		this.setVolume = function(val) {
			document.getElementById('aud_file').volume = val;
		};

		this.getVolume = function() {
			return document.getElementById('aud_file').volume;
		};

		this.volumeAdjust = function() {

			var new_vol_val = player.controls.volumeCtrl.value;

			if (new_vol_val > 0) {
				// Set the muted value of the audio element to false
				player.volume.setVolumeMutedFalse();
				if (new_vol_val > 0.5) {
					// Set the master player's UI control to high
					player.controls.volumeBtn.className = 'high';
				}
				else {
					player.controls.volumeBtn.className = 'low';
				}
			}
			else {
				// Set the audio element's muted value to true
				player.volume.setVolumeMutedTrue();
				player.controls.volumeBtn.className = 'off';
			}

			// Update the previous volume state at the end, so mute can be toggled correctly
			player.volume.previousVolume.value = player.volume.getVolume();
			player.volume.previousVolume.state = player.controls.volumeBtn.className;
			player.volume.setVolume(new_vol_val);
		};

		this.setVolumeMutedFalse = function() {
			document.getElementById('aud_file').muted = false;
		};

		this.setVolumeMutedTrue = function() {
			document.getElementById('aud_file').muted = true;
		};

		this.toggleMuteState = function(evt) {
			// Temporary variables to store current volume values
			var currentVolumeState = evt.target.className;
			var currentVolumeControlValue = player.volume.getVolume();

			if (currentVolumeState == 'low' || currentVolumeState == 'high') {
				evt.target.className = 'off';
				player.volume.setVolumeMutedTrue();
				player.controls.volumeCtrl.value = 0;
				player.volume.setVolume(0);
			}
			else {
				evt.target.className = this.previousVolume.state;
				player.volume.setVolumeMutedFalse();
				player.controls.volumeCtrl.value = this.previousVolume.value;
				player.volume.setVolume(this.previousVolume.value);
			}

			// Update the previous state
			this.previousVolume.state = currentVolumeState;
			this.previousVolume.value = currentVolumeControlValue;
		};
	};

	var Seek = function(player){
		/* Update seek control value and current time text */
		player.controls.seekCtrl.addEventListener('change',function() {
			player.seek.setAudioVideoTime();
		},false);

		this.updateSeekTime = function() {
			var newTime = player.time / player.duration;
			var gradient = ['to right'];
			// NEED TO DECIDE ON WHICH VIDEO'S BUFFER TO USE
			var buffered = player.slaves[0].video.buffered;
			player.controls.seekCtrl.value = newTime;
			if (buffered.length == 0) {
				gradient.push('rgba(255, 255, 255, 0.1) 0%');
			} else {
				// NOTE: the fallback to zero eliminates NaN.
				var bufferStartFraction = (buffered.start(0) / player.duration) || 0;
				var bufferEndFraction = (buffered.end(0) / player.duration) || 0;
				var playheadFraction = (player.time / player.duration) || 0;
				gradient.push('rgba(255, 255, 255, 0.1) ' + (bufferStartFraction * 100) + '%');
				gradient.push('rgba(255, 255, 255, 0.7) ' + (bufferStartFraction * 100) + '%');
				gradient.push('rgba(255, 255, 255, 0.7) ' + (playheadFraction * 100) + '%');
				gradient.push('rgba(255, 255, 255, 0.4) ' + (playheadFraction * 100) + '%');
				gradient.push('rgba(255, 255, 255, 0.4) ' + (bufferEndFraction * 100) + '%');
				gradient.push('rgba(255, 255, 255, 0.1) ' + (bufferEndFraction * 100) + '%');
			}
			player.controls.seekCtrl.style.background = 'linear-gradient(' + gradient.join(',') + ')';

			player.controls.updateCurrentTimeText(player.time);
		};
		/* Change current video time and text according to seek control value */
		this.setAudioVideoTime = function(){
			// Set the time of the video to be playing at
			var seekTo = player.duration * player.controls.seekCtrl.value;
			// Update the global current time value
			player.time = seekTo;
			// Update the UI controls to reflect the correct time
			player.controls.updateCurrentTimeText(seekTo);

			// Update the actual players to reflect the time for the video to be playing at
			player.util.forAllSlaves(setVideoTime, seekTo);

			// Set the time of the audio to be playing at
			player.audio.currentTime = seekTo;
		};

		var setVideoTime = function(slaveObj, theTime) {
			slaveObj.video.currentTime = theTime;
		}
	};

	var Zoom = function(player) {
		this.maxZoom = 7;

		/* Zooms into the position x, y with the amount clicks */
		this.zoom = function(clicks, x, y){
			//tt(ctx);
			var pt = player.ctx.transformedPoint(x, y);
			var factor = Math.pow(player.scaleFactor,clicks);
			var tx = player.transforms.xform.e;
			var ty = player.transforms.xform.f;
			var s = player.transforms.xform.a;
			if (factor*s >= 1 && factor*s <= this.maxZoom) {
				player.transforms.translate(pt.x,pt.y);
				player.transforms.scale(factor,factor);
				player.transforms.translate(-pt.x,-pt.y);
				player.controls.zoomCtrl.value = player.util.convertScaleToPercent(player.transforms.xform.a);
				player.transforms.refit();
			}
			player.transforms.redraw();
		}

		/* Private function to call zoom(clicks,x,y) from the UI Controls. */
		function zoomHelper(value) {
			var tx = player.transforms.xform.e;
			var ty = player.transforms.xform.f;
			var old_s = player.transforms.xform.a;
			var x = player.dimensions.cw/2;
			var y = player.dimensions.ch/2;
			player.zoom.zoom(value, x, y);
			player.controls.updateZoomUI();
		}
		/* Adjust zoom by adjusting the slider */
		this.adjust = function() {
			var zoomPercent = player.controls.zoomCtrl.value;
			var new_s = player.util.convertPercentToScale(zoomPercent);
			var old_s = player.transforms.xform.a;
			var delta_clicks = Math.log(new_s/old_s) / Math.log(player.scaleFactor);
			zoomHelper(delta_clicks);
		}

		/* Adjust zoom by clicking zoom in and out buttons */
		this.in = function() {
			zoomHelper(1);
		}
		this.out = function() {
			zoomHelper(-1);
		}
	};

	var Transforms = function(player) {
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
		this.savedTransforms = [];
		this.xform = svg.createSVGMatrix();

		var save = player.ctx.save;
		player.ctx.save = function(){
			this.savedTransforms.push(this.xform.translate(0,0));
			return save.call(player.ctx);
		};

		this.restore = function(){
			var restore = player.ctx.restore;
			this.xform = savedTransforms.pop();
			return restore.call(player.ctx);
		};

		this.scale = function(sx,sy){
			var scale = player.ctx.scale;
			this.xform = this.xform.scaleNonUniform(sx,sy);
			return scale.call(player.ctx,sx,sy);
		};

		this.rotate = function(radians){
			var rotate = player.ctx.rotate;
			this.xform = this.xform.rotate(radians*180/Math.PI);
			return rotate.call(player.ctx,radians);
		};

		this.translate = function(dx,dy){
			var translate = player.ctx.translate;
			this.xform = this.xform.translate(dx,dy);
			return translate.call(player.ctx,dx,dy);
		};

		this.transform = function(a,b,c,d,e,f){
			var transform = player.ctx.transform;
			var m2 = svg.createSVGMatrix();
			m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
			this.xform = this.xform.multiply(m2);
			return transform.call(player.ctx,a,b,c,d,e,f);
		};

		this.setTransform = function(a,b,c,d,e,f){
			var setTransform = player.ctx.setTransform;
			this.xform.a = a;
			this.xform.b = b;
			this.xform.c = c;
			this.xform.d = d;
			this.xform.e = e;
			this.xform.f = f;
			return setTransform.call(player.ctx,a,b,c,d,e,f);
		};

		var pt  = svg.createSVGPoint();
		player.ctx.transformedPoint = function(x,y){
			pt.x=x; pt.y=y;
			return pt.matrixTransform(player.transforms.xform.inverse());
		}

		/* Checks if the viewport borders intersect with the canvas borders
		** If it intersects, then scale/translate back the canvas accordingly to fit the viewport.*/
		this.refit = function() {
			var tx = player.transforms.xform.e;
			var ty = player.transforms.xform.f;
			var s = player.transforms.xform.a;
			if (s < 1 || s > player.zoom.maxZoom) {
				this.scale(1/s, 1/s);
			}
			if (tx > 0 ) {
				this.translate(-tx/s,0);
			}
			if (ty > 0) {
				this.translate(0,-ty/s);
			}
			if (tx+player.dimensions.cw*s < player.dimensions.cw) {
				var dx = (player.dimensions.cw - tx-player.dimensions.cw*s)/s;
				this.translate(dx, 0);
			}
			if (ty+player.dimensions.ch*s < player.dimensions.ch) {
				var dy = (player.dimensions.ch - ty-player.dimensions.ch*s)/s;
				this.translate(0, dy);
			}
		}
		this.redraw = function() {
			function slaveRedraw(slave) {
				slave.transforms.redraw();
			}
			player.util.forAllSlaves(slaveRedraw);
			// change dimensions and coords
			// slave.redraw for slaves still in view
		}
		this.outerTranslate = function() {
			var pt = player.ctx.transformedPoint(player.last.x,player.last.y);
			var dx = pt.x-player.dragStart.x;
			var dy = pt.y-player.dragStart.y;
			var tx = player.transforms.xform.e;
			var ty = player.transforms.xform.f;
			var flag = 0;
			var s = player.transforms.xform.a;

			if (tx+dx <= 0 && tx+player.dimensions.cw*s+dx > player.dimensions.cw) {
				this.translate(dx,0);
				flag = 1;
			}
			if (ty+dy <= 0 && ty+player.dimensions.ch*s+dy > player.dimensions.ch) {
				this.translate(0,dy);
				flag = 1;
			}
			/* if (flag = 0) {
			ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
			}*/
			this.redraw();
		}
	}

	var Util = function(player) {
		/* Helper methods to convert between the slider values and transformation matrix values */

		this.convertPercentToScale = function(percent) {
			var range = player.zoom.maxZoom - 1;
			return percent*range + 1;
		}
		this.convertScaleToPercent = function(scale) {
			var range = player.zoom.maxZoom - 1;
			return (scale-1)/range;
		}
		/* Function to converts seconds to HH:MM:SS format */
		this.convertSecondsToHMS = function(timeInSeconds) {
			var formattedTime = '';
			var hours = Math.floor(timeInSeconds / 3600);
			var mins = Math.floor((timeInSeconds / 60) % 60);
			var secs = Math.floor(timeInSeconds % 60);

			if (secs < 10)
			secs = '0' + secs;
			if (mins < 10)
			mins = '0' + mins;

			formattedTime = hours+':'+mins+':'+secs;

			return formattedTime;
		}

		this.forAllSlaves = function(someFunction, extraParam) {
			if (extraParam === undefined) {
				extraParam = 0;
				for (var i = 0; i < player.slaves.length; i++) {
					someFunction(player.slaves[i]);
				}
			}
			else {
				for (var i = 0; i < player.slaves.length; i++) {
					someFunction(player.slaves[i], extraParam);
				}
			}
		}

		this.setPauseArr = function(isPaused) {
			for (var i = 0; i < player.slavePauseArr.length; i++) {
				player.slavePauseArr[i] = isPaused;
			}
		}
	}

	var init_players = function(player, canvas, mpd_list) {
		var vidCount = 1;

		// Install polyfills for the browser
		shaka.polyfill.installAll();

		// Inject the video elements into the HTML
		var vidHtmlEle;
		for(var i = 1; i <= NUM_SLAVES; i++) {
			vidHtmlEle += '<video id="video_' + i + '" width="640" height="360" crossorigin="anonymous" controls src="' + '">Your browser does not support HTML5 video.</video>';
		}
		document.getElementById('zoomableVidElements').innerHTML = vidHtmlEle;

		// There should be a '4 column by 3 row' orientation of video players
		// To loop through the rows while we are on a column
		for(var rowNum = 0; rowNum < NUM_ROWS; rowNum++) {
			// To loop through the columns while we are on a row
			for(var colNum = 0; colNum < NUM_COLS; colNum++) {

				// Locate the video element
				var vid = document.getElementById('video_' + vidCount);

				// Attach the event handlers to the video element first
				vid.ontimeupdate = function(evt) {
					var vidTimeArrIndex = (evt.srcElement.id.substring(6) - 1);
					player.timeArr[vidTimeArrIndex] = vid.currentTime;   // Update the global array of current time value for this video object
					syncCurrentTime(player);  // Run the synchronization check for the current time
					player.seek.updateSeekTime();   // Update the seek time based on this new time
				};

				// Upon the 'pause' event
				vid.onpause = function(evt) {
					var vidTimeArrIndex = (evt.srcElement.id.substring(6) - 1);
					player.slavePauseArr[vidTimeArrIndex] = true;   // Update the global array of pause state value for this video object
					syncPauseState(player);	// Run the synchronization check for the overall pause state
				};

				// Upon the 'ended' event
				vid.addEventListener('ended', function(evt) {
					var vidTimeArrIndex = (evt.srcElement.id.substring(6) - 1);
					player.slaveEndArr[vidTimeArrIndex] = true;	// Update the global array of truth value for video end state
					syncEndState(player);	// Run the synchronization check for the overall end state
				}, false);

				// Set the src mpd for that video element
				vid.src = mpd_list[vidCount - 1];

				// Construct the Slave object and initialize it
				var coords = { x: colNum*VID_WIDTH, y: rowNum*VID_HEIGHT };
				var dimensions = { width: VID_WIDTH, height: VID_HEIGHT };

				var slaveObj = new Slave(vid, canvas, coords, dimensions); // Slave(video element, canvas it needs to draw to, coordinates to from, dimensions to draw within)
				player.slaves.push(slaveObj);
				slaveObj.init();

				// Construct the Shaka player to wrap around it
				var shakaPlayer = new shaka.player.Player(vid);
				// Attach the player to the window for debugging purposes (NEED TO CHECK IF CAN REMOVE)
				window.player = shakaPlayer;
				// Listen for errors from the Shaka Player
				shakaPlayer.addEventListener('error', function(event) {
					console.error(event);
				});
				// Construct a DashVideoSource to represent the DASH manifest
				var mpdUrl = mpd_list[vidCount - 1];
				var estimator = new shaka.util.EWMABandwidthEstimator();
				var src = new shaka.player.DashVideoSource(mpdUrl, null, estimator);
				// Load the src into the Shaka Player
				shakaPlayer.load(src);
				vidCount++;
			}
		}

		// Inject the audio element into the HTML
		// HARDCODED!!!!!! for now
		var audHtmlEle;
		audHtmlEle = '<audio id="aud_file" controls><source src="' + mpd_list[12] + '" type="audio/mpeg">Your browser does not support the audio element.</audio>';
		document.getElementById('zoomableAudElements').innerHTML = audHtmlEle;
		// Set the audio object of the Player
		player.audio = document.getElementById('aud_file');

	}

	var syncCurrentTime = function(player) {
		var earliestTime = null;
		for (var i = 0; i < (player.timeArr.length) - 1; i++) {
			if (earliestTime === null) {
				earliestTime = player.timeArr[i];
			}
			else {
				if (player.timeArr[i] < earliestTime) {
					earliestTime = player.timeArr[i];
				}
			}
		}
		player.time = earliestTime;

		// A check to see if the video has approximately ended (workaround)
		if (player.duration - player.time < 0.000001) {
			// Set the player.ended to true
			player.ended = true;
			// Change button to replay
			player.controls.changeToReplayState();
		}

	};

	var syncPauseState = function(player) {
		var newPauseState = player.paused;
		// After the for-loop, as long as 1 video is still playing, the paused
		// state will still be set to an overall false. i.e. Player is NOT paused
		for (var i = 0; i < (player.slavePauseArr.length) - 1; i++) {
			if (newPauseState == null) {
				newPauseState = player.slavePauseArr[i];
			}
			else {
				newPauseState = newPauseState && player.slavePauseArr[i];
			}
		}

		// Check if the values been changed, i.e. False -> True / True -> False
		// If they have been changed, update the UI controls
		if (player.paused != newPauseState) {
			player.paused = newPauseState;
			// Call the UI controls update
			// If the state is PAUSED, i.e. newPauseState == true
			if (player.paused == true) {
				player.controls.changeToPauseState();
			}
			else if (player.paused == false) {
				player.controls.changeToPlayState();
			}
			else {
				// For now: console log the error
				console.log("UH OH...");
			}
		}
	};

	var syncEndState = function(player) {
		// Check if there are NUM_SLAVES number of elements in the array, else
		// don't even bother doing comparisons
		if (player.slaveEndArr.length < NUM_SLAVES) {
			return;
		}
		var newEndState = true;
		// After the for-loop, as long as 1 video has not ended their session,
		// the overall end state will be set to false, i.e. Video has NOT ended
		for (var i = 0; i < (player.slaveEndArr.length) - 1; i++) {
			newEndState = newEndState && player.slaveEndArr[i];
		}

		// If the overall end state is true for all videos, reset the UI play
		// button to be the 'play' button
		if (newEndState == true) {
			// Reset the players
		}
	}

	var getVideoDuration = function(player) {
		player.slaves[0].video.onloadedmetadata = function() {
			player.duration = player.slaves[0].video.duration;
			player.controls.getVideoLength();
			return player.duration;
		};
	};

}
