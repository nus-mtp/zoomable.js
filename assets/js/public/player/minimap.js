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
	this.x = 0;
	this.y = 0;
	this.new_width = this.canvas.width;

    this.init = function() {
        this.outline = new Outline(this);
    }

    var Outline = function(minimap) {
        this.draw = function(x,y,width,height) {
			// Update with new values of x, y and new_width first
			player.minimap.x = 0;
			player.minimap.y = 0;
			player.minimap.new_width = width;
			// Clear the minimap rectangle first
			player.minimap.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
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
