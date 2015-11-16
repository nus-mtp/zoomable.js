var createCanvasControls = function(video, canvas, playPauseBtn, uiControls, currentTimeTxt, totalTimeTxt, seekCtrl, volumeBtn, volumeCtrl, zoomOutBtn, zoomCtrl, zoomInBtn) {
    var ctx = canvas.getContext('2d');
    var scaleFactor = 1.1;
    var zoomFactor = 1;
    var maxZoom = 7;
    var cw = 640;
    var ch = 360;


    video.addEventListener('play', function(){
        draw(this,ctx,cw,ch);
    },false);
    setCanvasControlsListeners();
    trackTransforms(ctx);
    redraw(video,ctx,cw,ch);	
    var lastX=canvas.width/2, lastY=canvas.height/2;
    var dragStart,dragged;
    canvas.addEventListener('mousedown',mouseDown,false);
    canvas.addEventListener('mousemove',mouseMove,false);
    canvas.addEventListener('mouseup',mouseUp,false);
    canvas.addEventListener('DOMMouseScroll',handleScroll,false);
    canvas.addEventListener('mousewheel',handleScroll,false);

    function mouseDown(evt){
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragStart = ctx.transformedPoint(lastX,lastY);
        dragged = false;
    }

    function mouseMove(evt){
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragged = true;
        if (dragStart){
            translate(video, ctx, dragStart, lastX, lastY, cw, ch);
        }
    }
    function mouseUp(evt){
        dragStart = null;
        //if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
    }

    /* Prints the current transformation matrix (rotation not used)
    ** scale_x, scale_y \n translation_x, translation_y  */
    function printMat() {
        console.log(ctx.getTransform().a + ", " + ctx.getTransform().d);
        console.log(ctx.getTransform().e + ", " + 
                   ctx.getTransform().f);
        console.log("width: " + cw*ctx.getTransform().a);
        console.log("height: " + ch *ctx.getTransform().a);
        console.log("______");
    }
    function handleScroll(evt){
        var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
        if (delta) zoom(video, ctx, delta, lastX, lastY, zoomCtrl, maxZoom, scaleFactor, cw, ch);
        return evt.preventDefault() && false;
    }
   //ctx, clicks, x, y, button, maxZoom)
    

    /* functions for UI controls */

    var previousVolumeState = '';
    var previousVolumeControlValue = 0;

    /* create event listeners for canvas controls */
    function setCanvasControlsListeners() {
        // Add event listeners
        video.addEventListener('loadedmetadata',getVideoLength,false);
        video.addEventListener('timeupdate',updateSeekTime,false);
        seekCtrl.addEventListener('change',videoSeek,false);
        playPauseBtn.addEventListener('click',function(){
            playPauseVideo(video);
        },false);
        video.addEventListener('pause',function(){
            changeToPauseState(playPauseBtn, uiControls);
        },false);
        video.addEventListener('play',function(){
            changeToPlayState(playPauseBtn, uiControls);
        },false);     
        //volumeBtn.addEventListener('click',toggleMuteState,false);
        volumeBtn.addEventListener('click',function(){
            toggleMuteState(event, video, volumeCtrl, previousVolumeState, previousVolumeControlValue);
        },false);
        volumeCtrl.addEventListener('change',function(){
            volumeAdjust(previousVolumeControlValue, previousVolumeState, video, volumeBtn, volumeCtrl);
        },false);
        video.addEventListener('volumechange',updateVolumeUI,false);
        zoomInBtn.addEventListener('click',zoomIn,false);
        zoomOutBtn.addEventListener('click',zoomOut,false);
        zoomCtrl.addEventListener('change',zoomAdjust,false);

        // Set default values
        video.volume = 0.5;
        previousVolumeControlValue = video.volume;
    }

    /* Retrieve total duration of video and update total time text */
    function getVideoLength() {
        var convertedTotalTime = convertSecondsToHMS(video.duration);
        totalTimeTxt.innerHTML = convertedTotalTime;
    }

    /* Update seek control value and current time text */
    function updateSeekTime(){    
        var newTime = video.currentTime/video.duration;
        var gradient = ['to right'];
        var buffered = video.buffered;

        seekCtrl.value = newTime;

        if (buffered.length == 0) {
        gradient.push('rgba(255, 255, 255, 0.1) 0%');
        } else {
        // NOTE: the fallback to zero eliminates NaN.
        var bufferStartFraction = (buffered.start(0) / video.duration) || 0;
        var bufferEndFraction = (buffered.end(0) / video.duration) || 0;
        var playheadFraction = (video.currentTime / video.duration) || 0;
        gradient.push('rgba(255, 255, 255, 0.1) ' + (bufferStartFraction * 100) + '%');
        gradient.push('rgba(255, 255, 255, 0.7) ' + (bufferStartFraction * 100) + '%');
        gradient.push('rgba(255, 255, 255, 0.7) ' + (playheadFraction * 100) + '%');
        gradient.push('rgba(255, 255, 255, 0.4) ' + (playheadFraction * 100) + '%');
        gradient.push('rgba(255, 255, 255, 0.4) ' + (bufferEndFraction * 100) + '%');
        gradient.push('rgba(255, 255, 255, 0.1) ' + (bufferEndFraction * 100) + '%');
        }
        seekCtrl.style.background = 'linear-gradient(' + gradient.join(',') + ')';

        updateCurrentTimeText(video.currentTime);
    }

    /* Change current video time and text according to seek control value */
    function videoSeek(){
        var seekTo = video.duration * seekCtrl.value;
        video.currentTime = seekTo;

        updateCurrentTimeText(video.currentTime);
    }

    /* Convert and update current time text */
    function updateCurrentTimeText(time) {
        var convertedTime = convertSecondsToHMS(time);
        currentTimeTxt.innerHTML = convertedTime;
    }

    /* Update volume control UI */
    function updateVolumeUI() {
        var gradient = ['to right'];
        gradient.push('#ccc ' + (volumeCtrl.value * 100) + '%');
        gradient.push('rgba(255, 255, 255, 0.3) ' + (volumeCtrl.value * 100) + '%');
        gradient.push('rgba(255, 255, 255, 0.3) 100%');
        volumeCtrl.style.background = 'linear-gradient(' + gradient.join(',') + ')';
    }
    
    /* General function to call zoom(clicks,x,y) from the UI Controls. */
    function zoomHelper(value) {
        var tx = ctx.getTransform().e;
        var ty = ctx.getTransform().f;
        var old_s = ctx.getTransform().a;     
        var x = cw/2;
        var y = ch/2; 
        zoom(video, ctx, value, x, y, zoomCtrl, maxZoom, scaleFactor, cw, ch);
    }
    /* Adjust zoom by adjusting the slider */
    function zoomAdjust() {
        var zoomPercent = zoomCtrl.value;
        var new_s = convertPercentToScale(zoomPercent, maxZoom);
        var old_s = ctx.getTransform().a;
        var delta_clicks = Math.log(new_s/old_s) /Math.log(scaleFactor);
        zoomHelper(delta_clicks); 
    }
    
    /* Adjust zoom by clicking zoom in and out buttons */
    function zoomIn() {
        zoomHelper(1);
    }
    function zoomOut() {
        zoomHelper(-1);
    }
    
};

/* Play or pause the video */
function playPauseVideo(video) {
    if(video.paused)
        video.play();
    else 
        video.pause();
}

/* Updates icon to "play" button during pause state, show UI controls bar */
function changeToPauseState(playPauseBtn, uiControls) {
    playPauseBtn.className = 'play';
    uiControls.className = '';
}

/* Updates icon to "pause" button during play state, hide UI controls bar */
function changeToPlayState(playPauseBtn, uiControls) {
    playPauseBtn.className = 'pause';
    uiControls.className = 'hideOnHover';
}

/* Adjust volume using volume control and update UI and mute state */
function volumeAdjust(previousVolumeControlValue, previousVolumeState, video, volumeBtn, volumeCtrl) {
    previousVolumeControlValue = video.volume;
    previousVolumeState = volumeBtn.className;
    video.volume = volumeCtrl.value;

    if (video.volume > 0) {
        video.muted = false;
        if (video.volume > 0.5)
            volumeBtn.className = 'high';
        else 
            volumeBtn.className = 'low';
    }
    else {
        video.muted = true;
        volumeBtn.className = 'off';
    }
}

/* Toggle mute on or off, saves previous states of volume and its value */
function toggleMuteState(evt, video, volumeCtrl, previousVolumeState, previousVolumeControlValue) {
    var currentVolumeState = evt.target.className;
    var currentVolumeControlValue = video.volume;

    if (currentVolumeState == 'low' || currentVolumeState == 'high') {
        previousVolumeState = currentVolumeState;
        previousVolumeControlValue = currentVolumeControlValue;
        evt.target.className = 'off';
        video.muted = true;
        volumeCtrl.value = 0;
    }
    else {
        // if volume is already zero, do nothing on pressing mute button again
        if (video.volume == 0)
            return;   
        else 
            evt.target.className = previousVolumeState;
        previousVolumeState = currentVolumeState;
        video.muted = false;
        volumeCtrl.value = previousVolumeControlValue;
        previousVolumeControlValue = currentVolumeControlValue;
    }
}

/* Function to converts seconds to HH:MM:SS format */
function convertSecondsToHMS(timeInSeconds) {
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

function draw(v,c,w,h) {
    //if(v.paused || v.ended) return false;
    c.drawImage(v,0,0,w,h);
    setTimeout(draw,20,v,c,w,h);
}

function redraw(video,ctx,cw,ch){
    // Clear the entire canvas
    var p1 = ctx.transformedPoint(0,0);
    var p2 = ctx.transformedPoint(canvas.width,canvas.height);
    //ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
    // Alternatively:
    // ctx.save();
    // ctx.setTransform(1,0,0,1,0,0);
    // ctx.clearRect(0,0,canvas.width,canvas.height);
    // ctx.restore();
    draw(video,ctx,cw,ch);
}

function translate(video, ctx, dragStart, lastX, lastY, cw, ch) {
    var pt = ctx.transformedPoint(lastX,lastY);
    var dx = pt.x-dragStart.x;
    var dy = pt.y-dragStart.y;
    var tx = ctx.getTransform().e;
    var ty = ctx.getTransform().f;
    var flag = 0;
    var s = ctx.getTransform().a;
    if (tx+dx <= 0 && tx+cw*s+dx > cw) { 
            ctx.translate(dx,0);
            flag = 1;
    }
    if (ty+dy <= 0 && ty+ch*s+dy > ch) {
            ctx.translate(0,dy);
            flag = 1;
    }
   /* if (flag = 0) {
        ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
    }*/
    redraw(video, ctx, cw, ch);   
}

/* Zooms into the position x, y with the amount clicks */
function zoom(video, ctx, clicks, x, y, button, maxZoom, scaleFactor, cw, ch){
    //tt(ctx);
    var pt = ctx.transformedPoint(x, y);
    var factor = Math.pow(scaleFactor,clicks);
    var tx = ctx.getTransform().e;
    var ty = ctx.getTransform().f;
    var s = ctx.getTransform().a;
    if (factor*s >= 1 && factor*s <= maxZoom) {
        ctx.translate(pt.x,pt.y);
        ctx.scale(factor,factor);
        ctx.translate(-pt.x,-pt.y);
        button.value = convertScaleToPercent(ctx.getTransform().a, maxZoom);
        refit(ctx, maxZoom, cw, ch);
    }
    redraw(video,ctx,cw,ch); 
}


/* Checks if the viewport borders intersect with the canvas borders
** If it intersects, then scale/translate back the canvas accordingly to fit the viewport.*/
function refit(ctx, maxZoom, cw, ch) {
    var tx = ctx.getTransform().e;
    var ty = ctx.getTransform().f;
    var s = ctx.getTransform().a;
    console.log("zoom: " + s);
    if (s < 1 || s > maxZoom) {
        ctx.scale(1/s, 1/s);    
    }
    if (tx > 0 ) {
        ctx.translate(-tx,0);
    }
    if (ty > 0) {
        ctx.translate(0,-ty);
    }
    if (tx+cw*s < cw) {
        var dx = cw - tx-cw*s;
        var sum =tx+cw*s;
        ctx.translate(dx, 0);
    } 
    if (ty+ch*s < ch) {
        var dy = ch - ty-ch*s;
        ctx.translate(0, dy);
    }
}

function trackTransforms(ctx){
    var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
    var xform = svg.createSVGMatrix();
    ctx.getTransform = function(){ return xform; };

    var savedTransforms = [];
    var save = ctx.save;
    ctx.save = function(){
        savedTransforms.push(xform.translate(0,0));
        return save.call(ctx);
    };
    var restore = ctx.restore;
    ctx.restore = function(){
        xform = savedTransforms.pop();
        return restore.call(ctx);
    };

    var scale = ctx.scale;
    ctx.scale = function(sx,sy){
        xform = xform.scaleNonUniform(sx,sy);
        return scale.call(ctx,sx,sy);
    };
    var rotate = ctx.rotate;
    ctx.rotate = function(radians){
        xform = xform.rotate(radians*180/Math.PI);
        return rotate.call(ctx,radians);
    };
    var translate = ctx.translate;
    ctx.translate = function(dx,dy){
        xform = xform.translate(dx,dy);
        return translate.call(ctx,dx,dy);
    };
    var transform = ctx.transform;
    ctx.transform = function(a,b,c,d,e,f){
        var m2 = svg.createSVGMatrix();
        m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
        xform = xform.multiply(m2);
        return transform.call(ctx,a,b,c,d,e,f);
    };
    var setTransform = ctx.setTransform;
    ctx.setTransform = function(a,b,c,d,e,f){
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx,a,b,c,d,e,f);
    };
    var pt  = svg.createSVGPoint();
    ctx.transformedPoint = function(x,y){
        pt.x=x; pt.y=y;
        return pt.matrixTransform(xform.inverse());
    }
}

/* Helper methods to convert between the slider values and transformation matrix values */
    function convertPercentToScale(percent, maxZoom) {
        var range = maxZoom - 1;
        return percent*range + 1;
    }
    function convertScaleToPercent(scale, maxZoom) {
        var range = maxZoom - 1;
        return (scale-1)/range;
    }