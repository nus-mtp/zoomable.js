var Slave = function(vid, canv, coords, dims, parent) {
	this.master = parent;
	this.video = vid;
	this.canvas = canv;
	this.ctx = canv.getContext('2d');
	this.coords = coords;
	this.dims = dims;
	// this.scaleFactor; << might need this later
	this.controls;
	this.transforms;
	this.vf; 				// videoframe object
	this.id;
	this.init = function(id) {
		this.id = id;
		this.controls = new Controls(this);
		this.transforms = new Transforms(this);
		console.log(dims);

		this.vf = VideoFrame({
			    id : 'video_' + id,
			    frameRate: FrameRates.web,
				callback: function(response, format) {
				}
			});
	}
	var Controls = function(slave) {
		// Attach the event handlers to the video element first
		slave.video.addEventListener('timeupdate', function(evt) { slave.controls.updateTime(evt); } );

		// Upon the 'pause' event
		slave.video.addEventListener('pause', function(evt) { slave.controls.updatePause(evt); } );

		// Upon the 'ended' event
		slave.video.addEventListener('ended', function(evt) { slave.controls.updateEnd(evt); }, false);

		this.updateTime = function(evt) {
			var vidTimeArrIndex = (evt.srcElement.id.substring(6) - 1);
			slave.master.timeArr[vidTimeArrIndex] = slave.video.currentTime;   // Update the global array of current time value for this video object
			slave.master.sync.currentTime();  // Run the synchronization check for the current time
			slave.master.seek.updateSeekTime();   // Update the seek time based on this new time
		}

		this.updatePause = function(evt) {
			var vidTimeArrIndex = (evt.srcElement.id.substring(6) - 1);
			slave.master.slavePauseArr[vidTimeArrIndex] = true;   // Update the global array of pause state value for this video object
			slave.master.sync.pauseState();	// Run the synchronization check for the overall pause state
		}
		this.updateEnd = function(evt) {
			var vidTimeArrIndex = (evt.srcElement.id.substring(6) - 1);
			slave.master.slaveEndArr[vidTimeArrIndex] = true;	// Update the global array of truth value for video end state
			slave.master.sync.endState();	// Run the synchronization check for the overall end state
		}

	}
	var Transforms = function(slave) {
		slave.video.addEventListener('play', function() {
			slave.transforms.draw();
		},false);

		this.draw = function() {
			//slave.master.sync.frames();
			//slave.master.seek.updateSeekTime();
			if (!slave.video.paused) { 	//if(v.paused || v.ended) return false;
				slave.ctx.drawImage(slave.video,coords.x,coords.y,dims.width,dims.height);
			}
			//slave.ctx.drawImage(slave.video,coords.x,coords.y,dims.width,dims.height);
			setTimeout(slave.transforms.draw,33);
		}

		this.redraw = function(){
			slave.ctx.drawImage(slave.video,coords.x,coords.y,dims.width,dims.height);
		}
	}
}
