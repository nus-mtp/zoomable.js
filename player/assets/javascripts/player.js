
var Slave = function(vid, canv, coords, dims) {
    this.video = vid;
    this.canvas = canv;
    this.ctx = canv.getContext('2d');
    this.draw = function() {
        //if(v.paused || v.ended) return false;
    
        player.ctx.drawImage(player.video,coords.x,coords.y,dims.width,dims.height);
    };
    this.redraw = function(){
        // Clear the entire canvas
        var p1 = player.ctx.transformedPoint(0,0);
        var p2 = player.ctx.transformedPoint(player.dimensions.cw,player.dimensions.ch);
        //ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
        player.ctx.fillStyle = 'rgb(0,0,0)';
        player.ctx.fillRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
        // Alternatively:
        // ctx.save();
        // ctx.setTransform(1,0,0,1,0,0);
        // ctx.clearRect(0,0,canvas.width,canvas.height);
        // ctx.restore();   
        player.transforms.refit();
        this.draw();
    };
}

var Player = function(canvas, mpd_list) {

    var VID_WIDTH = 160;
    var VID_HEIGHT = 120;
    var NUM_SLAVES = 12;
    var NUM_ROWS = 3;
    var NUM_COLS = 4;
    
    this.time;
    this.duration;

    this.slaves = []; //array of slave objects
    this.paused;
    
    //this.video = vid;
    this.canvas = canvas;
    this.ctx = canv.getContext('2d');
    this.scaleFactor = 1.1;
    this.zoomFactor = 1;
    this.dimensions = { cw:canvas.width, ch:canvas.height };
    this.last;
    this.dragStart;
    this.dragged;
    this.mouseactions;
    this.scroll;
    this.controls;
    this.volume;
    this.seek;
    this.zoom;
    this.transforms;
    this.util;

    this.init = function() {
        init_players(this, canvas, mpd_list)
        this.volume = new Volume(this);

        this.scroll = new Scroll(this);
        
        this.zoom = new Zoom(this);
        this.controls = new Controls(this);
        this.transforms = new Transforms(this);
        this.seek = new Seek(this);
        this.transforms = new Transforms(this);
        this.util = new Util(this);
        this.transforms.draw();	
        this.last = { x: canvas.width/2, y: canvas.height/2 };
        this.volume.setVolume(0.5); //set default vol of video
        this.mouseactions = new MouseActions(this);
    };


    
    var MouseActions = function(player) {
        player.canvas.addEventListener('mousedown',function(event) { player.mouseactions.mouseDown(event); },false);
        player.canvas.addEventListener('mousemove',function(event) { player.mouseactions.mouseMove(event); },false);
        player.canvas.addEventListener('mouseup',function(event) { player.mouseactions.mouseUp(event); },false); 

        
        this.mouseDown = function(evt){
            document.body.style.mozUserSelect = 
                document.body.style.webkitUserSelect = 
                document.body.style.userSelect = 'none';
            player.last.x = evt.offsetX || (evt.pageX - player.canvas.offsetLeft);
            player.last.y = evt.offsetY || (evt.pageY - player.canvas.offsetTop);
            player.dragStart = player.ctx.transformedPoint(player.last.x,player.last.y);
            player.dragged = false;
        };
        this.mouseMove = function(evt){
            player.last.x = evt.offsetX || (evt.pageX - player.canvas.offsetLeft);
            player.last.y = evt.offsetY || (evt.pageY - player.canvas.offsetTop);
            player.dragged = true;
            if (player.dragStart){
                player.transforms.outerTranslate();
            }
        };
        this.mouseUp = function(evt){
            player.dragStart = null;
        }
    };
    
    var Scroll = function(player) {
        canvas.addEventListener('DOMMouseScroll',function(event) { player.scroll.handle(event); },false);
        canvas.addEventListener('mousewheel',function(event) { player.scroll.handle(event); },false);
        
        this.handle = function(evt){
            var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
                if (delta) {
                    //updateSliderUI(zoomCtrl);
                    player.zoom.zoom(delta, player.last.x, player.last.y);
                    player.controls.updateZoomUI();
                }
                return evt.preventDefault() && false;
            }
    };

    var Controls = function(player) {
      
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
/*
        player.video.addEventListener('loadedmetadata',function(){
            player.controls.getVideoLength()
        },false);*/
        this.playPauseBtn.addEventListener('click',function(){
            player.controls.playPauseVideo(this.playPauseVideo);
        },false);
        player.video.addEventListener('pause',function(){
            player.controls.changeToPauseState(this.playPauseBtn, this.uiControls);
        },false);
        player.video.addEventListener('play',function(){
            player.controls.changeToPlayState(this.playPauseBtn, this.uiControls);
        },false);
        this.volumeBtn.addEventListener('click',function(){
            player.volume.toggleMuteState(event);
            player.controls.updateSliderUI(player.controls.volumeCtrl);
        },false);
        this.volumeCtrl.addEventListener('change',function(){
            player.volume.volumeAdjust();
            player.controls.updateSliderUI(player.controls.volumeCtrl);
        },false);
        player.video.addEventListener('volumechange',function(){
            player.controls.updateSliderUI(player.controls.volumeCtrl);
        },false);
        this.volumeCtrl.addEventListener('mousemove',function(){
          player.controls.updateSliderUI(player.controls.volumeCtrl);
        },false);
        this.zoomInBtn.addEventListener('click',function(){
            player.zoom.in();
        },false);
        this.zoomOutBtn.addEventListener('click',function(){
            player.zoom.out();
        },false);
        this.zoomCtrl.addEventListener('change',function(){
            player.zoom.adjust();
        },false);
        this.zoomCtrl.addEventListener('mousemove',function(){
          player.controls.updateSliderUI(player.controls.zoomCtrl);
        },false);
        
        /* Play or pause the video */
        this.playPauseVideo = function() {
            if(player.video.paused) {
                player.video.play();
            }
            else {
                player.video.pause();
            }
        }

        /* Updates icon to "play" button during pause state, show UI controls bar */
        this.changeToPauseState = function() {
            this.playPauseBtn.className = 'play';
            this.uiControls.className = '';
        }

        /* Updates icon to "pause" button during play state, hide UI controls bar */
        this.changeToPlayState = function() {
            this.playPauseBtn.className = 'pause';
            this.uiControls.className = 'hideOnHover';
        }
        /* Retrieve total duration of video and update total time text */
        this.getVideoLength = function() {
            var convertedTotalTime = player.util.convertSecondsToHMS(player.video.duration);
            this.totalTimeTxt.innerHTML = convertedTotalTime;
        };
    
        /* Convert and update current time text */
        this.updateCurrentTimeText = function(time) {
            var convertedTime = player.util.convertSecondsToHMS(time);
            this.currentTimeTxt.innerHTML = convertedTime;
        };
        
        /* Update zoom control UI */
        this.updateZoomUI = function() {
            this.zoomCtrl.value = player.util.convertScaleToPercent(player.transforms.xform.a);
            this.updateSliderUI(this.zoomCtrl);
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
    
    // QUESTION: How to decide which player to 'follow' audio stream from? Should audio stream be separate?
    var Volume = function(player){
        this.previousVolume = { 
            state: 'low',
            value: player.video.volume // Which player to get volume from?
        };
        this.setVolume = function(val) {
            // Set the volume of all the players to the parameter val
            forAllPlayers(setVolumeNew, player.slaves, val);
        };
        this.volumeAdjust = function() {

            var new_vol_val = player.controls.volumeCtrl.value;
            // For all players, update the new volume value
            forAllPlayers(setVolumeNew, player.slaves, new_vol_val);
            if (new_vol_val > 0) {
                // For all players, set muted value to false
                forAllPlayers(setVolumeFalse, player.slaves);
                if (new_vol_val > 0.5) {
                    // Set the master player's UI control to high
                    player.controls.volumeBtn.className = 'high';
                }
                else {
                    player.controls.volumeBtn.className = 'low';
                } 
            } 
            else {
                // Set all the players' muted value to true
                forAllPlayers(setVolumeTrue, player.slaves);
                player.controls.volumeBtn.className = 'off';
            }
            // update previous state at the end so mute can be toggled correctly
            player.volume.previousVolume.value = player.video.volume;   // Which player to get volume from?
            player.volume.previousVolume.state = player.volumeBtn.className;
        };

        var setVolumeNew = function(eachPlayer, newVolume) {
            eachPlayer.video.volume = newVolume;
        }

        var setVolumeFalse = function(eachPlayer) {
            eachPlayer.video.muted = false;
        }

        var setVolumeTrue = function(eachPlayer) {
            eachPlayer.video.muted = true;
        }
        
        this.toggleMuteState = function(evt) {
            // temporary variables to store current volume values
            var currentVolumeState = evt.target.className;
            var currentVolumeControlValue = player.video.volume;    // Which player to get volume from?

            if (currentVolumeState == 'low' || currentVolumeState == 'high') {
                evt.target.className = 'off';
                player.video.muted = true;
                player.controls.volumeCtrl.value = 0;
                player.video.volume = 0;
            }
            else {
                evt.target.className = this.previousVolume.state;
                player.video.muted = false;
                player.controls.volumeCtrl.value = this.previousVolume.value;
                player.video.volume = this.previousVolume.value;
            }

            // update previous state
            this.previousVolume.state = currentVolumeState;
            this.previousVolume.value = currentVolumeControlValue;
        }
    };
    
    var Seek = function(player){
        /* Update seek control value and current time text */
        player.video.addEventListener('timeupdate',function() { player.seek.updateSeekTime(); },false);
        player.controls.seekCtrl.addEventListener('change',function() { player.seek.setVideoTime(); },false);

        this.updateSeekTime = function(){ 
            var newTime = player.video.currentTime/player.video.duration;
            var gradient = ['to right'];
            var buffered = player.video.buffered;
            player.controls.seekCtrl.value = newTime;
            if (buffered.length == 0) {
                gradient.push('rgba(255, 255, 255, 0.1) 0%');
            } else {
                // NOTE: the fallback to zero eliminates NaN.
                var bufferStartFraction = (buffered.start(0) / player.video.duration) || 0;
                var bufferEndFraction = (buffered.end(0) / player.video.duration) || 0;
                var playheadFraction = (player.video.currentTime / player.video.duration) || 0;
                gradient.push('rgba(255, 255, 255, 0.1) ' + (bufferStartFraction * 100) + '%');
                gradient.push('rgba(255, 255, 255, 0.7) ' + (bufferStartFraction * 100) + '%');
                gradient.push('rgba(255, 255, 255, 0.7) ' + (playheadFraction * 100) + '%');
                gradient.push('rgba(255, 255, 255, 0.4) ' + (playheadFraction * 100) + '%');
                gradient.push('rgba(255, 255, 255, 0.4) ' + (bufferEndFraction * 100) + '%');
                gradient.push('rgba(255, 255, 255, 0.1) ' + (bufferEndFraction * 100) + '%');
            }
            player.controls.seekCtrl.style.background = 'linear-gradient(' + gradient.join(',') + ')';

            player.controls.updateCurrentTimeText(player.video.currentTime);
        };
         /* Change current video time and text according to seek control value */
        this.setVideoTime = function(){
            var seekTo = player.video.duration * player.controls.seekCtrl.value;
            player.video.currentTime = seekTo;
            player.controls.updateCurrentTimeText(player.video.currentTime);
        };
    
    };
    
    var Zoom = function(player) {
        this.maxZoom = 7;
        
        /* Zooms into the position x, y with the amount clicks */
        this.zoom = function(clicks, x, y){
            //tt(ctx);
            var pt = player.ctx.transformedPoint(x, y);
            var factor = Math.pow(player.scaleFactor,clicks);
            var tx = player.transforms.xform.e;
            var ty = player.transforms.xform.f;
            var s = player.transforms.xform.a;
            if (factor*s >= 1 && factor*s <= this.maxZoom) {
                player.transforms.translate(pt.x,pt.y);
                player.transforms.scale(factor,factor);
                player.transforms.translate(-pt.x,-pt.y);
                player.controls.zoomCtrl.value = player.util.convertScaleToPercent(player.transforms.xform.a);
                player.transforms.refit();
            }
            player.transforms.redraw(); 
        } 
        
        /* Private function to call zoom(clicks,x,y) from the UI Controls. */
        function zoomHelper(value) {
            var tx = player.transforms.xform.e;
            var ty = player.transforms.xform.f;
            var old_s = player.transforms.xform.a;
            var x = player.dimensions.cw/2;
            var y = player.dimensions.ch/2;
            player.zoom.zoom(value, x, y);
            player.controls.updateZoomUI();
        }
        /* Adjust zoom by adjusting the slider */
        this.adjust = function() {
            var zoomPercent = player.controls.zoomCtrl.value;
            var new_s = player.util.convertPercentToScale(zoomPercent);
            var old_s = player.transforms.xform.a;
            var delta_clicks = Math.log(new_s/old_s) / Math.log(scaleFactor);
            zoomHelper(delta_clicks); 
        }

        /* Adjust zoom by clicking zoom in and out buttons */
        this.in = function() {
            zoomHelper(1);
        }
        this.out = function() {
            zoomHelper(-1);
        }        
    }
    
    var Transforms = function(player) {
        player.video.addEventListener('play', function(){
            player.transforms.draw();
        },false);

        var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
        this.savedTransforms = [];
        this.xform = svg.createSVGMatrix();

        var save = player.ctx.save;
        player.ctx.save = function(){
            this.savedTransforms.push(this.xform.translate(0,0));
            return save.call(player.ctx);
        };
    
        this.restore = function(){
            var restore = player.ctx.restore;
            this.xform = savedTransforms.pop();
            return restore.call(player.ctx);
        };

        this.scale = function(sx,sy){
            var scale = player.ctx.scale;
            this.xform = this.xform.scaleNonUniform(sx,sy);
            return scale.call(player.ctx,sx,sy);
        };
    
        this.rotate = function(radians){
            var rotate = player.ctx.rotate;
            this.xform = this.xform.rotate(radians*180/Math.PI);
            return rotate.call(player.ctx,radians);
        };
    
        this.translate = function(dx,dy){
            var translate = player.ctx.translate;
            this.xform = this.xform.translate(dx,dy);
            return translate.call(player.ctx,dx,dy);
        };
    
        this.transform = function(a,b,c,d,e,f){
            var transform = player.ctx.transform;
            var m2 = svg.createSVGMatrix();
            m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
            this.xform = this.xform.multiply(m2);
            return transform.call(player.ctx,a,b,c,d,e,f);
        };
        
        this.setTransform = function(a,b,c,d,e,f){
            var setTransform = player.ctx.setTransform;
            this.xform.a = a;
            this.xform.b = b;
            this.xform.c = c;
            this.xform.d = d;
            this.xform.e = e;
            this.xform.f = f;
            return setTransform.call(player.ctx,a,b,c,d,e,f);
        };
        
        var pt  = svg.createSVGPoint();
        player.ctx.transformedPoint = function(x,y){
            pt.x=x; pt.y=y;
            return pt.matrixTransform(player.transforms.xform.inverse());
        }
        
        /* Checks if the viewport borders intersect with the canvas borders
        ** If it intersects, then scale/translate back the canvas accordingly to fit the viewport.*/
        this.refit = function() {
            var tx = player.transforms.xform.e;
            var ty = player.transforms.xform.f;
            var s = player.transforms.xform.a;
            if (s < 1 || s > player.zoom.maxZoom) {
                this.scale(1/s, 1/s);    
            }
            if (tx > 0 ) {
                this.translate(-tx/s,0);
            }
            if (ty > 0) {
                this.translate(0,-ty/s);
            }
            if (tx+player.dimensions.cw*s < player.dimensions.cw) {
                var dx = (player.dimensions.cw - tx-player.dimensions.cw*s)/s;
                this.translate(dx, 0);
            } 
            if (ty+player.dimensions.ch*s < player.dimensions.ch) {
                var dy = (player.dimensions.ch - ty-player.dimensions.ch*s)/s;
                this.translate(0, dy);
            }
        }

        this.draw = function() {
            //if(v.paused || v.ended) return false;
            player.ctx.drawImage(player.video,coords.x,coords.y,dims.width,dims.height);
            setTimeout(player.transforms.draw,20);
        }
        

        this.redraw = function(){
            // Clear the entire canvas
            var p1 = player.ctx.transformedPoint(0,0);
            var p2 = player.ctx.transformedPoint(player.dimensions.cw,player.dimensions.ch);
            //ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
            player.ctx.fillStyle = 'rgb(0,0,0)';
            player.ctx.fillRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
            // Alternatively:
            // ctx.save();
            // ctx.setTransform(1,0,0,1,0,0);
            // ctx.clearRect(0,0,canvas.width,canvas.height);
            // ctx.restore();   
            player.transforms.refit();
            this.draw();
        }

        this.outerTranslate = function() {
            var pt = player.ctx.transformedPoint(player.last.x,player.last.y);
            var dx = pt.x-player.dragStart.x;
            var dy = pt.y-player.dragStart.y;
            var tx = player.transforms.xform.e;
            var ty = player.transforms.xform.f;
            var flag = 0;
            var s = player.transforms.xform.a;

            if (tx+dx <= 0 && tx+player.dimensions.cw*s+dx > player.dimensions.cw) { 
                    this.translate(dx,0);
                    flag = 1;
            }
            if (ty+dy <= 0 && ty+player.dimensions.ch*s+dy > player.dimensions.ch) {
                    this.translate(0,dy);
                    flag = 1;
            }
           /* if (flag = 0) {
                ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
            }*/
            this.redraw();   
        }
    }
    
    var Util = function(player) {
        /* Helper methods to convert between the slider values and transformation matrix values */
        this.convertPercentToScale = function(percent) {
            var range = player.zoom.maxZoom - 1;
            return percent*range + 1;
        }
        this.convertScaleToPercent = function(scale) {
            var range = player.zoom.maxZoom - 1;
            return (scale-1)/range;
        }
        /* Function to converts seconds to HH:MM:SS format */
        this.convertSecondsToHMS = function(timeInSeconds) {
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
    }

    var init_players = function(player, canvas, mpd_list) {
        var vidCount = 1;

        // Install polyfills for the browser
        shaka.polyfill.installAll();

        // Inject the video elements into the HTML
        var vidHtmlEle;
        for(var i = 1; i <= NUM_PLAYERS; i++) {
            vidHtmlEle += '<video id="video_' + i + '" width="640" height="360" crossorigin="anonymous" controls src="' + mpd_list[i - 1] + '">Your browser does not support HTML5 video.</video>';
        }
        document.getElementById('zoomableVidElements').innerHTML = vidHtmlEle;

        // There should be a '4 column by 3 row' orientation of video players
        // To loop through the rows while we are on a column
        for(var rowNum = 0; rowNum < NUM_ROWS; rowNum++) {
            // To loop through the columns while we are on a row
            for(var colNum = 0; colNum < NUM_COLS; colNum++) {
                // Locate the video element
                var vid = document.getElementById('video_' + vidCount);
                // Construct the Shaka player to wrap around it
                var shakaPlayer = new shaka.player.Player(vid);
                // Attach the player to the window for debugging purposes (NEED TO CHECK IF CAN REMOVE)
                window.player = shakaPlayer;
                // Listen for errors from the Shaka Player
                shakaPlayer.addEventListener('error', function(event) {
                    console.error(event);
                });
                // Construct a DashVideoSource to represent the DASH manifest
                var mpdUrl = mpd_list[vidCount - 1];
                var estimator = new shaka.util.EWMABandwidthEstimator();
                var src = new shaka.player.DashVideoSource(mpdUrl, null, estimator);
                // Load the src into the Shaka Player
                shakaPlayer.load(src);

                // To instantiate a new Slave object for each Shaka video player
                var coords = { x: colNum*VID_WIDTH, y: rowNum*VID_HEIGHT };
                var dimensions = { width: VID_WIDTH, height: VID_HEIGHT };
                var single_player = new Slave(vid, canvas, coords, dimensions); // Slave(video element, canvas it needs to draw to, coordinates to from, dimensions to draw within)
                player.slaves.push(single_player);
                vidCount++;
            }
        }  
    }

    var forAllPlayers = function(someFunction, slaveArr, extraParam) {
        if (extraParam === undefined) {
            extraParam = 0;
            for (int i = 0; i < slaveArr.size(); i++) {
                someFunction(slaveArr[i]);
            }
        }
        else {
            for (int i = 0; i < slaveArr.size(); i++) {
                someFunction(slaveArr[i], extraParam);
            }
        }
    };
}


// The list of MPDs are hardcoded here for now, will eventually run a script to detect the relevant MPDs to retrieve
var mpdList = [];
for(var i = 1; i <= 3; i++) {
    for(var j = 1; j <= 4; j++) {
        mpdList.push('/../../../../../../TEST/squirrel_video/squirrel_video_mpd_R' + i + 'C' + j + '.mpd');
    }
}

// On 'DOMContentLoaded', create a master Player object and initialize
var vidCount = 1;
document.addEventListener('DOMContentLoaded', function() {
    canvas_obj = document.getElementById('canvas');
    list_of_mpds = mpdList;
    var loadPlayers = new Player(canvas_obj, list_of_mpds);
    loadPlayers.init();
}, false);