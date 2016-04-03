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


		this.vf = VideoFrame({
			    id : 'video_' + id,
			    frameRate: FrameRates.web,
				callback: function(response, format) {
				}
			});
	}
	var Controls = function(slave) {
		// Attach the event handlers to the video element first
		if (slave.id == 1) {
			slave.video.addEventListener('timeupdate', function(evt) {
				slave.controls.updateTime(evt);
				//slave.controls.updateFrame(evt);
				slave.master.seek.updateSeekTime();
			} );
		}
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
		this.updateFrame = function(evt) {
			var vidFrameArrIndex = (evt.srcElement.id.substring(6) - 1);
	//		console.log(slave.vf.get());
			slave.master.frameArr[vidFrameArrIndex] = slave.vf.get();   // Update the global array of current frame value for this video object
			slave.master.sync.currentFrame();  // Run the synchronization check for the current frame
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
			if (slave.id == 1) {
				slave.master.frameArr[0] = slave.vf.get()
			}
			if (slave.id != 1) {
				slave.vf.seekTo({frame: slave.master.frameArr[0]});
				//console.log(slave.master.frameArr[0])
				//slave.controls.updateTime(slave.id - 1);
				//slave.controls.updateFrame(slave.id - 1);
			}
			//slave.master.seek.updateSeekTime();
			if (!slave.video.paused) { 	//if(v.paused || v.ended) return false;
				//slave.frameCnt += 1;
				//console.log(slave.frameCnt);
				if (slave.id != 1) console.log('id: ' + slave.id + " drawing");
				slave.ctx.drawImage(slave.video,coords.x,coords.y,dims.width,dims.height);
			}
			//slave.ctx.drawImage(slave.video,coords.x,coords.y,dims.width,dims.height);
			setTimeout(slave.transforms.draw,1000);
			//setTimeout(slave.transforms.draw,20);
		}

		this.redraw = function(){
			// Clear the entire canvas
			// * var p1 = slave.ctx.transformedPoint(0,0);
			// * var p2 = slave.ctx.transformedPoint(slave.dimensions.cw,slave.dimensions.ch);
			//ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
			// * slave.ctx.fillStyle = 'rgb(0,0,0)';
			// * slave.ctx.fillRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
			// Alternatively:
			// ctx.save();
			// ctx.setTransform(1,0,0,1,0,0);
			// ctx.clearRect(0,0,canvas.width,canvas.height);
			// ctx.restore();
			//slave.transforms.refit();
			slave.ctx.drawImage(slave.video,coords.x,coords.y,dims.width,dims.height);
		}
	}
}
