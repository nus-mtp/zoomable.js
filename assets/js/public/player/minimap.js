var Minimap = function(canvas, video, parent) {
    this.player = parent;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.video = video;
    //this.transforms = new Transforms(this);
    this.outline;
    this.init = function() {
        this.outline = new Outline(this);
    }
    var Outline = function(minimap) {
        this.draw = function(x,y,width,height) {
            //draws the red border
            minimap.ctx.beginPath();
            minimap.ctx.lineWidth="1";
            minimap.ctx.strokeStyle="red";
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
