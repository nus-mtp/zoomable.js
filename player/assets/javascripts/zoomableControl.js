var Zoomable = function(canvas, mpd_list) {
    
    var VID_WIDTH = 160;
    var VID_HEIGHT = 120;
    var NUM_PLAYERS = 12;
    var NUM_ROWS = 3;
    var NUM_COLS = 4;

    this.time;

    this.players = []; //array of player objects
    this.paused;
    this.seek;
    this.volume;
    this.zoom;
    this.pan;

    this.init = function() {
        init_players(this, canvas, mpd_list);
        this.controls = new Controls(this);
    };
    
    this.play = function() {
        for(var i=0; i<NUM_PLAYERS; i++) {
            var player = this.players[i];
            player.video.play;
            //Need to check all players not paused
            //Use Q
            //For now:
            this.paused = false;
        }
    };
    this.pause = function() {
        for(var i=0; i<NUM_PLAYERS; i++) {
            var player = this.players[i];
            player.video.pause;
            //Need to check that all players have been paused
            //Use Q
            //For now:
            this.paused = true;
        }        
    };
    var Seek = function() {};
    var Volume = function() {};
    
    var Controls = function(zoomable) {
      
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
        zoomable.video.addEventListener('loadedmetadata',function(){
            zoomable.controls.getVideoLength()
        },false);*/
        this.playPauseBtn.addEventListener('click',function(){
            zoomable.controls.playPauseVideo(this.playPauseVideo);
        },false);
        //zoomable.video.addEventListener('pause',function(){
        //    zoomable.controls.changeToPauseState(this.playPauseBtn, this.uiControls);
        //},false);
        //zoomable.video.addEventListener('play',function(){
        //    zoomable.controls.changeToPlayState(this.playPauseBtn, this.uiControls);
        //},false);
        this.volumeBtn.addEventListener('click',function(){
            //zoomable.volume.toggleMuteState(event);
            zoomable.controls.updateSliderUI(zoomable.controls.volumeCtrl);
        },false);
        this.volumeCtrl.addEventListener('change',function(){
            //zoomable.volume.volumeAdjust();
            zoomable.controls.updateSliderUI(zoomable.controls.volumeCtrl);
        },false);
        //zoomable.video.addEventListener('volumechange',function(){
        //    zoomable.controls.updateSliderUI(zoomable.controls.volumeCtrl);
        //},false);
        this.volumeCtrl.addEventListener('mousemove',function(){
            zoomable.controls.updateSliderUI(zoomable.controls.volumeCtrl);
        },false);
        this.zoomInBtn.addEventListener('click',function(){
            //zoomable.zoom.in();
        },false);
        this.zoomOutBtn.addEventListener('click',function(){
            //zoomable.zoom.out();
        },false);
        this.zoomCtrl.addEventListener('change',function(){
            //zoomable.zoom.adjust();
        },false);
        this.zoomCtrl.addEventListener('mousemove',function(){
          zoomable.controls.updateSliderUI(zoomable.controls.zoomCtrl);
        },false);
        
        /* Play or pause the video */
        this.playPauseVideo = function() {
            if(zoomable.paused) {
                zoomable.play();
            }
            else {
                zoomable.pause();
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
            var convertedTotalTime = zoomable.util.convertSecondsToHMS(zoomable.video.duration);
            this.totalTimeTxt.innerHTML = convertedTotalTime;
        };
    
        /* Convert and update current time text */
        this.updateCurrentTimeText = function(time) {
            var convertedTime = zoomable.util.convertSecondsToHMS(time);
            this.currentTimeTxt.innerHTML = convertedTime;
        };
        
        /* Update zoom control UI */
        this.updateZoomUI = function() {
            this.zoomCtrl.value = zoomable.util.convertScaleToPercent(zoomable.transforms.xform.a);
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
    var Zoom = function() {};
    var Pan = function() {};

    
/** PRIVATE FUNCTIONS **/    

    var init_players = function(zoomable, canvas, mpd_list) {
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
                player.addEventListener('error', function(event) {
                    console.error(event);
                });
                // Construct a DashVideoSource to represent the DASH manifest
                var mpdUrl = mpd_list[vidCount - 1];
                var estimator = new shaka.util.EWMABandwidthEstimator();
                var src = new shaka.player.DashVideoSource(mpdUrl, null, estimator);
                // Load the src into the Shaka Player
                player.load(src);

                // To instaniate a new Player object for each Shaka video player
                // ASSUME: video elements are already present in the HTML
                var coords = { x: colNum*VID_WIDTH, y: rowNum*VID_HEIGHT };
                var dimensions = { width: VID_WIDTH, height: VID_HEIGHT };
                var single_player = new Player(vid, canvas, coords, dimensions); 
                single_player.init();
                zoomable.players.push(single_player);
                vidCount++;
            }
        }  
    };
    
    var util = { 
        /* Function to converts seconds to HH:MM:SS format */
        convertSecondsToHMS: function(timeInSeconds) {
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
        },    
    };     
    
    
}


// The list of MPDs are hardcoded here for now, will eventually run a script to detect the relevant MPDs to retrieve
var mpdList = [];
for(var i = 1; i <= 3; i++) {
    for(var j = 1; j <= 4; j++) {
        mpdList.push('/../../../../../../TEST/squirrel_video/squirrel_video_mpd_R' + i + 'C' + j + '.mpd');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    var zoomable = new Zoomable(document.getElementById('canvas'), mpdList);
    zoomable.init();
}, false);
