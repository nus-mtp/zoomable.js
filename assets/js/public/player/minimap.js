var Minimap = function(canvas, rect_canv, video, parent) {
    this.player = parent;
    this.canvas = canvas;
    this.rect_canv = rect_canv;
    this.ctx = this.rect_canv.getContext('2d');
    this.ctx_v = this.canvas.getContext('2d');
    this.video = video;
    //this.transforms = new Transforms(this);
    this.outline;

	// For stats
	this.x_coord;
	this.y_coord;
	this.new_width;

    this.init = function() {
		this.x_coord = 0;
		this.y_coord = 0;
		this.new_width = canvas.width;
        this.outline = new Outline(this);
    }

    var Outline = function(minimap) {
        this.draw = function(x,y,width,height) {
			// Update with new values of x, y and new_width first
			minimap.x_coord = x;
			minimap.y_coord = y;
			minimap.new_width = width;
			// Clear the minimap rectangle first
			minimap.ctx.clearRect(0,0,minimap.canvas.width,minimap.canvas.height);
            //draws the red border
            minimap.ctx.beginPath();
            minimap.ctx.lineWidth="1.5";
            minimap.ctx.strokeStyle="#00BCD4";
            minimap.ctx.rect(x,y,width,height);
            minimap.ctx.stroke();
        }
    }

    var Transforms = function(minimap) {
		minimap.video.addEventListener('play', function() {
			minimap.transforms.draw();
		},false);

		this.draw = function() {
			if (!minimap.video.paused) { 	//if(v.paused || v.ended) return false;
				//slave.frameCnt += 1;
				//console.log(slave.frameCnt);
				minimap.ctx.drawImage(minimap.video);    //,coords.x,coords.y,dims.width,dims.height);
			}
			//slave.ctx.drawImage(slave.video,coords.x,coords.y,dims.width,dims.height);
			requestAnimationFrame(minimap.transforms.draw)
			//setTimeout(slave.transforms.draw,20);
		}
    }
}
