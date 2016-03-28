var Minimap = function(canvas, video, parent) {
    this.player = parent;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.video = video;
    this.outline = new Outline(this);

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
}
