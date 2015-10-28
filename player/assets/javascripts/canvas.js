document.addEventListener('DOMContentLoaded', function(){
    var v = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var scaleFactor = 1.1;
    var zoomFactor = 0;


    /*var cw = Math.floor(canvas.clientWidth / 100);
    var ch = Math.floor(canvas.clientHeight / 100);
    canvas.width = cw;
    canvas.height = ch;/*/
    var cw = 640;
    var ch = 360;

    v.addEventListener('play', function(){
        draw(this,ctx,cw,ch);
    },false);
    
    trackTransforms(ctx);
    redraw();	
    var lastX=canvas.width/2, lastY=canvas.height/2;
    var dragStart,dragged;
    canvas.addEventListener('mousedown',mouseDown,false);
    canvas.addEventListener('mousemove',mouseMove,false);
    canvas.addEventListener('mouseup',mouseUp,false);
    canvas.addEventListener('DOMMouseScroll',handleScroll,false);
    canvas.addEventListener('mousewheel',handleScroll,false);

    function draw(v,c,w,h) {
        if(v.paused || v.ended) return false;
        c.drawImage(v,0,0,w,h);
        setTimeout(draw,20,v,c,w,h);
    }

    function redraw(){
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

        draw(v,ctx,cw,ch);
    }

    function mouseDown(evt){
        document.body.style.mozUserSelect =         document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
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
            var pt = ctx.transformedPoint(lastX,lastY);
            ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
            redraw();
        }
    }
    function mouseUp(evt){
        dragStart = null;
        if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
    }

    function zoom(clicks){
        var pt = ctx.transformedPoint(lastX,lastY);
        ctx.translate(pt.x,pt.y);
        var factor = Math.pow(scaleFactor,clicks);
        ctx.scale(factor,factor);
        ctx.translate(-pt.x,-pt.y);
        redraw(); 
    }

    function handleScroll(evt){
        var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
        if (delta) zoom(delta);
        return evt.preventDefault() && false;
    }

    
},false); //Line 1: document.addEventListener('DOMContentLoaded', ...

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

/* functions for UI controls */

var video, currentTimeTxt, totalTimeTxt, playPauseBtn, seekCtrl, volumeBtn, volumeCtrl, uiControls;
var previousVolumeState = '';
var previousVolumeControlValue = 0;

/* initialise the video controls on the canvas */
function initialiseCanvasControls() {
    // Set object references
    video = document.getElementById('video');
    currentTimeTxt = document.getElementById('currentTimeTxt');
    totalTimeTxt = document.getElementById('totalTimeTxt');
    playPauseBtn = document.getElementById('playPauseBtn');
    seekCtrl = document.getElementById('seekCtrl');
    volumeBtn = document.getElementById('volumeBtn');
    volumeCtrl = document.getElementById('volumeCtrl');
    uiControls = document.getElementById('uiControls');

    // Add event listeners
    video.addEventListener('loadedmetadata',getVideoLength,false);
    video.addEventListener('timeupdate',updateSeekTime,false);
    seekCtrl.addEventListener('change',videoSeek,false);
    playPauseBtn.addEventListener('click',playPauseVideo,false);
    video.addEventListener('pause',changeToPauseState,false);
    video.addEventListener('play',changeToPlayState,false);     
    volumeBtn.addEventListener('click',toggleMuteState,false);
    volumeCtrl.addEventListener('change',volumeAdjust,false);
    // Set default values
    video.volume = 0.5;
    previousVolumeControlValue = video.volume;
}
document.addEventListener('DOMContentLoaded', initialiseCanvasControls);

/* Retrieve total duration of video and update total time text */
function getVideoLength() {
    var convertedTotalTime = convertSecondsToHMS(video.duration);
    totalTimeTxt.innerHTML = convertedTotalTime;
}

/* Update seek control value and current time text */
function updateSeekTime(){
    var newTime = video.currentTime/video.duration;
    seekCtrl.value = newTime;

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

/* Play or pause the video */
function playPauseVideo() {
    if(video.paused)
        video.play();
    else 
        video.pause();
}

/* Updates icon to "play" button during pause state, show UI controls bar */
function changeToPauseState() {
    playPauseBtn.className = 'play';
    uiControls.className = '';
}

/* Updates icon to "pause" button during play state, hide UI controls bar */
function changeToPlayState() {
    playPauseBtn.className = 'pause';
    uiControls.className = 'hideOnHover';
}

/* Toggle mute on or off, saves previous states of volume and its value */
function toggleMuteState(evt) {
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

/* Adjust volume using volume control and update UI and mute state */
function volumeAdjust() {
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