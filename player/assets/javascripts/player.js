var Player = Player || {};

Player.player = {
    ctx         : canvas.getContext('2d'),
    scaleFactor : 1.1,
    zoomFactor  : 1,
    maxZoom     : 7,
    cw          : 640,
    ch          : 360   
}


Player.mouseActions = {
    mouseDown: function(evt){
        document.body.style.mozUserSelect = 
            document.body.style.webkitUserSelect = 
            document.body.style.userSelect = 'none';
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragStart = ctx.transformedPoint(lastX,lastY);
        dragged = false;
    },
    mouseMove: function(evt){
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragged = true;
        if (dragStart){
            translate(video, ctx, dragStart, lastX, lastY, cw, ch);
        }
    },
    mouseUp: function(evt){
        dragStart = null;
    }
}

Player.controls = {
    init: function(video) {
        var v = document.getElementById('video');
        var canvas = document.getElementById('canvas');
        var playPauseBtn = document.getElementById('playPauseBtn');
        var uiControls = document.getElementById('uiControls');
        var currentTimeTxt = document.getElementById('currentTimeTxt');
        var totalTimeTxt = document.getElementById('totalTimeTxt');
        var seekCtrl = document.getElementById('seekCtrl');
        var volumeBtn = document.getElementById('volumeBtn');
        var volumeCtrl = document.getElementById('volumeCtrl');
        var zoomOutBtn = document.getElementById('zoomOutBtn');
        var zoomCtrl = document.getElementById('zoomCtrl');
        var zoomInBtn = document.getElementById('zoomInBtn');
        
        playPauseBtn.addEventListener('click',function(){
            playPauseVideo(video);
        },false);
        video.addEventListener('pause',function(){
            changeToPauseState(playPauseBtn, uiControls);
        },false);
        video.addEventListener('play',function(){
            changeToPlayState(playPauseBtn, uiControls);
        },false);
        volumeBtn.addEventListener('click',function(){
            toggleMuteState(event, video, volumeCtrl, previousVolume);
            updateSliderUI(volumeCtrl);
        },false);
        volumeCtrl.addEventListener('change',function(){
            volumeAdjust(previousVolume, video, volumeBtn, volumeCtrl);
            updateSliderUI(volumeCtrl);
        },false);
        video.addEventListener('volumechange',updateSliderUI(volumeCtrl),false);
        volumeCtrl.addEventListener('mousemove',function(){
          updateSliderUI(volumeCtrl);
        },false);
        zoomInBtn.addEventListener('click',zoomIn,false);
        zoomOutBtn.addEventListener('click',zoomOut,false);
        zoomCtrl.addEventListener('change',zoomAdjust,false);
        zoomCtrl.addEventListener('mousemove',function(){
          updateSliderUI(zoomCtrl);
        },false);

    },
}
    