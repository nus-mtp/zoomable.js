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
		slave.video.addEventListener('timeupdate', function(evt) {
			slave.controls.updateTime(evt);
			slave.controls.updateFrame(evt);
		} );

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
			if (!slave.video.paused) { 	//if(v.paused || v.ended) return false;
				//slave.frameCnt += 1;
				//console.log(slave.frameCnt);
				slave.ctx.drawImage(slave.video,coords.x,coords.y,dims.width,dims.height);
			}
			//slave.ctx.drawImage(slave.video,coords.x,coords.y,dims.width,dims.height);
			requestAnimationFrame(slave.transforms.draw)
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

		/* UNCOMMENT IF ALLOWING ZOOM INTO A SINGLE SLAVE

		var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
		this.savedTransforms = [];
		this.xform = svg.createSVGMatrix();

		var save = slave.ctx.save;
		slave.ctx.save = function(){
			this.savedTransforms.push(this.xform.translate(0,0));
			return save.call(slave.ctx);
		};

		this.restore = function(){
			var restore = slave.ctx.restore;
			this.xform = savedTransforms.pop();
			return restore.call(slave.ctx);
		};

		this.scale = function(sx,sy){
			var scale = slave.ctx.scale;
			this.xform = this.xform.scaleNonUniform(sx,sy);
			return scale.call(slave.ctx,sx,sy);
		};

		this.rotate = function(radians){
			var rotate = slave.ctx.rotate;
			this.xform = this.xform.rotate(radians*180/Math.PI);
			return rotate.call(slave.ctx,radians);
		};

		this.translate = function(dx,dy){
			var translate = slave.ctx.translate;
			this.xform = this.xform.translate(dx,dy);
			return translate.call(slave.ctx,dx,dy);
		};

		this.transform = function(a,b,c,d,e,f){
			var transform = slave.ctx.transform;
			var m2 = svg.createSVGMatrix();
			m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
			this.xform = this.xform.multiply(m2);
			return transform.call(slave.ctx,a,b,c,d,e,f);
		};

		this.setTransform = function(a,b,c,d,e,f){
			var setTransform = slave.ctx.setTransform;
			this.xform.a = a;
			this.xform.b = b;
			this.xform.c = c;
			this.xform.d = d;
			this.xform.e = e;
			this.xform.f = f;
			return setTransform.call(slave.ctx,a,b,c,d,e,f);
		};

		var pt  = svg.createSVGPoint();
		slave.ctx.transformedPoint = function(x,y){
			pt.x=x; pt.y=y;
			return pt.matrixTransform(slave.transforms.xform.inverse());
		}

		// Checks if the viewport borders intersect with the canvas borders
		// If it intersects, then scale/translate back the canvas accordingly to fit the viewport.
		this.refit = function() {
			var tx = slave.transforms.xform.e;
			var ty = slave.transforms.xform.f;
			var s = slave.transforms.xform.a;
			if (s < 1 || s > slave.zoom.maxZoom) {
				this.scale(1/s, 1/s);
			}
			if (tx > 0 ) {
				this.translate(-tx/s,0);
			}
			if (ty > 0) {
				this.translate(0,-ty/s);
			}
			if (tx+slave.dimensions.cw*s < slave.dimensions.cw) {
				var dx = (slave.dimensions.cw - tx-slave.dimensions.cw*s)/s;
				this.translate(dx, 0);
			}
			if (ty+slave.dimensions.ch*s < slave.dimensions.ch) {
				var dy = (slave.dimensions.ch - ty-slave.dimensions.ch*s)/s;
				this.translate(0, dy);
			}
		}

		this.outerTranslate = function(dragStart) {
			var pt = slave.ctx.transformedPoint(slave.last.x,slave.last.y);
			var dx = pt.x-dragStart.x;
			var dy = pt.y-dragStart.y;
			var tx = slave.transforms.xform.e;
			var ty = slave.transforms.xform.f;
			var flag = 0;
			var s = slave.transforms.xform.a;

			if (tx+dx <= 0 && tx+slave.dimensions.cw*s+dx > slave.dimensions.cw) {
				this.translate(dx,0);
				flag = 1;
			}
			if (ty+dy <= 0 && ty+slave.dimensions.ch*s+dy > slave.dimensions.ch) {
				this.translate(0,dy);
				flag = 1;
			}
			// if (flag = 0) {
			//ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
			//}
			this.redraw();
		} */
	}
}
