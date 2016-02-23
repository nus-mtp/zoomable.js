var Zoomable = function(canvas, player_list) {
    
    var VID_WIDTH = 160;
    var VID_HEIGHT = 120;
    var NUM_PLAYERS = 12;
    var NUM_ROWS = 3;
    var NUM_COLS = 4;

    init_players(canvas, player_list);

    this.time;

    this.players = []; //array of player objects
    this.play;
    this.pause;
    this.seek;
    this.volume;
    this.controls = new Controls(this);

    this.zoom;
    this.pan;

    var Play = function() {};
    var Pause = function() {};
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
        
        var q_array = [];
        for (var i=0; i<NUM_PLAYERS; i++) {
            q_array[i] = new Q.defer();
        }
        for (var j=0; i<NUM_PLAYERS; j++) {
            var player = zoomable.players[i];
            player.video.addEventListener('loadedmetadata',function(){
                q_array[i].resolve(player.video.duration);
            },false);
        }
        Q.allSettled(q_array).done(function(video_lengths) {
            zoomable.controls.setVideoLength();
            //player.controls.getVideoLength()
        })
        
        
        /* Retrieve total duration of video and update total time text */
        this.setVideoLength = function(durations) {
            // Currently gets only the first duration. It should all be the same.
            var convertedTotalTime = util.convertSecondsToHMS(durations[0]);
            this.totalTimeTxt.innerHTML = convertedTotalTime;
        };
    
        
    };
    var Zoom = function() {};
    var Pan = function() {};
    
/** PRIVATE FUNCTIONS **/    

    var init_players = function(canvas, player_list) {
        var vidCount = 1;

        // Install polyfills for the browser
        shaka.polyfill.installAll();

        // Inject the video elements into the HTML
        var vidHtmlEle;
        for(var i = 1; i <= NUM_PLAYERS; i++) {
            vidHtmlEle += '<video id="video_' + i + '" width="640" height="360" crossorigin="anonymous" controls src="' + player_list[i - 1] + '">Your browser does not support HTML5 video.</video>';
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
                var mpdUrl = player_list[vidCount - 1];
                var estimator = new shaka.util.EWMABandwidthEstimator();
                var src = new shaka.player.DashVideoSource(mpdUrl, null, estimator);
                // Load the src into the Shaka Player
                player.load(src);

                // To instaniate a new Player object for each Shaka video player
                // ASSUME: video elements are already present in the HTML
                var coords = { x: colNum*VID_WIDTH, y: rowNum*VID_HEIGHT };
                var dimensions = { width: VID_WIDTH, height: VID_HEIGHT }
                var zoomablePlayer = new Player(vid, canvas, coords, dimensions); 
                zoomablePlayer.init()
                vidCount++;
            }
        }  
    }
    
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
        }    
    } 
}

// The list of MPDs are hardcoded here for now, will eventually run a script to detect the relevant MPDs to retrieve
var mpdList = [];
for(var i = 1; i <= 3; i++) {
    for(var j = 1; j <= 4; j++) {
        mpdList.push('http://zoomable.comp.nus.edu.sg/squirrel_segment/squirrel_video/squirrel_video_mpd_R' + i + 'C' + j + '.mpd');
    }


document.addEventListener('DOMContentLoaded', function() {
    var initZoomableControls = new Zoomable(document.getElementById('canvas'), mpdList);
}, false);
>>>>>>> 3623811d12c9ec08eea1c985740f12d86ce0c65e
