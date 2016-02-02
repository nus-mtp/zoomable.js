var Player = function(vid,canv) {
    this.video = vid;
    this.canvas = canv;
    this.ctx = canvas.getContext('2d');
    this.scaleFactor = 1.1;
    this.zoomFactor = 1;
    this.maxZoom = 7;
    this.dimensions = { cw:640, ch:360 };
    this.lastX, lastY, dragStart, dragged, mouseactions, scroll, controls, volume, seek;

    this.init = function() {
        this.mouseactions = new MouseActions();
        this.scroll = new Scroll();
        this.controls = new Controls();
        this.volume = new Volume();
        this.seek = new Seek();
        this.video.addEventListener('play', function(){
            draw(this,ctx,cw,ch);
        },false);
        this.controls.init();
        //trackTransforms(ctx);
        //redraw(video,ctx,cw,ch);	
        this.lastX = canvas.width/2;
        this.lastY = canvas.height/2;
        this.canvas.addEventListener('mousedown',mouseActions.mouseDown,false);
        this.canvas.addEventListener('mousemove',mouseActions.mouseMove,false);
        this.canvas.addEventListener('mouseup',mouseActions.mouseUp,false);
        //canvas.addEventListener('DOMMouseScroll',handleScroll,false);
        //canvas.addEventListener('mousewheel',handleScroll,false);
        this.volume.setVolume(0.5); //set default vol of video
    };
    
    var MouseActions = function(player) {
        this.mouseDown = function(evt){
            document.body.style.mozUserSelect = 
                document.body.style.webkitUserSelect = 
                document.body.style.userSelect = 'none';
            player.lastX = evt.offsetX || (evt.pageX - player.canvas.offsetLeft);
            player.lastY = evt.offsetY || (evt.pageY - player.canvas.offsetTop);
            player.dragStart = player.ctx.transformedPoint(lastX,lastY);
            player.dragged = false;
        };
        this.mouseMove = function(evt){
            var lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft);
            var lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop);
            this.dragged = true;
            if (this.dragStart){
                //this.translate(video, ctx, dragStart, lastX, lastY, cw, ch);
            }
        };
        this.mouseUp = function(evt){
            this.dragStart = null;
        }
    };
    
    var Scroll = function(player) {
        this.handle = function(evt){
            var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
                if (delta) {
                    //updateZoomUI();
                    //updateSliderUI(zoomCtrl);
                    zoom(video, ctx, delta, lastX, lastY, 
                         zoomCtrl, maxZoom, scaleFactor, cw, ch);
                    updateZoomUI();
                }
                return evt.preventDefault() && false;
            }
    };

    var Controls = function(player) {
        this.playPauseBtn = null; 
        this.uiControls: null;
        this.currentTimeTxt: null;
        this.totalTimeTxt: null;
        this.seekCtrl: null;
        this.volumeBtn: null; 
        this.volumeCtrl: null; 
        this.zoomOutBtn: null; 
        this.zoomCtrl: null;
        this.zoomInBtn: null;

        this.init = function() {
            /* binds to UI and adds listeners for controls*/
            this.playPauseBtn = document.getElementById('playPauseBtn');
            this.uiControls = document.getElementById('uiControls');
            this.currentTimeTxt = document.getElementById('currentTimeTxt');
            this.totalTimeTxt = document.getElementById('totalTimeTxt');
            this.seekCtrl = document.getElementById('seekCtrl');
            this.volumeBtn = document.getElementById('volumeBtn');
            this.volumeCtrl = document.getElementById('volumeCtrl');
            this.zoomOutBtn = document.getElementById('zoomOutBtn');
            this.zoomCtrl = document.getElementById('zoomCtrl');
            this.zoomInBtn = document.getElementById('zoomInBtn');

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
        };
        
        /* Retrieve total duration of video and update total time text */
        this.getVideoLength = function() {
            var convertedTotalTime = convertSecondsToHMS(video.duration);
            totalTimeTxt.innerHTML = convertedTotalTime;
        };
    
        /* Convert and update current time text */
        this.updateCurrentTimeText = function(time) {
            var convertedTime = convertSecondsToHMS(time);
            currentTimeTxt.innerHTML = convertedTime;
        };
        
        /* Update zoom control UI */
        this.updateZoomUI = function() {
            zoomCtrl.value = convertScaleToPercent(ctx.getTransform().a, maxZoom);
            updateSliderUI(zoomCtrl);
        };

        /* Update slider color when slider value changes - for zoomCtrl/volumeCtrl */
        this.updateSliderUI = function(element) {
            var gradient = ['to right'];
            gradient.push('#ccc ' + (element.value * 100) + '%');
            gradient.push('rgba(255, 255, 255, 0.3) ' + (element.value * 100) + '%');
            gradient.push('rgba(255, 255, 255, 0.3) 100%');
            element.style.background = 'linear-gradient(' + gradient.join(',') + ')';
        };
        
    };
    
    var Volume = function(player){
        this.previousVolume = { 
            state: 'low',
            value: video.volume
        };
        this.setVolume = function(val) { 
            video.volume = val; 
        };
        this.volumeAdjust = function(previousVolume, video, volumeBtn, volumeCtrl) {
            video.volume = volumeCtrl.value;
            if (video.volume > 0) {
                video.muted = false;
                if (video.volume > 0.5) volumeBtn.className = 'high';
                else volumeBtn.className = 'low';
            } else {
                video.muted = true;
                controls.volumeBtn.className = 'off';
            }
            // update previous state at the end so mute can be toggled correctly
            this.previousVolume.value = video.volume;
            this.previousVolume.state = volumeBtn.className;
        }; 
    };
    
    var Seek = function(player){
        /* Update seek control value and current time text */
        this.updateSeekTime = function(){    
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
            controls.seekCtrl.style.background = 'linear-gradient(' + gradient.join(',') + ')';

            this.updateCurrentTimeText(video.currentTime);
        };
         /* Change current video time and text according to seek control value */
        this.setVideoTime = function(){
            var seekTo = video.duration * controls.seekCtrl.value;
            video.currentTime = seekTo;

            this.updateCurrentTimeText(video.currentTime);
        };
        
        this.updateCurrentTimeText = function(time) {
            var convertedTime = convertSecondsToHMS(time);
            currentTimeTxt.innerHTML = convertedTime;
        };
    };
    
}
document.addEventListener('DOMContentLoaded', function() { var zoomable = new Player(document.getElementById('video'), document.getElementById('canvas')); }, false);
    