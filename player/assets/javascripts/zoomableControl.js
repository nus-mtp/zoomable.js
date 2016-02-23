var Zoomable = function(canvas, player_list) {
    var NUM_OF_PLAYERS = 12;
    
    init_players(player_list);
    
    this.time = ;
    this.players = []; //array of player objects
    this.play = ;
    this.pause = ;
    this.seek = ;
    this.volume = ;
    this.controls = new Controls(this);
    this.zoom = ;
    this.pan = ;
    
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
        for (var i=0; i<NUM_OF_PLAYERS; i++) {
            q_array[i] = new Q.defer();
        }
        for (var j=0; i<NUM_OF_PLAYERS; j++) {
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
    
    var init_players = function(player_list) {
        // initialise player objects using mpds from player_list
        
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