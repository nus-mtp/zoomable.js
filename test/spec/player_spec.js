describe("Video player controls", function() {
  // declare gobal variables
  var video, canvas, playPauseBtn, uiControls, currentTimeTxt, totalTimeTxt, seekCtrl, volumeBtn, volumeCtrl, zoomOutBtn, zoomCtrl, zoomInBtn, fullscreenBtn;

  beforeEach(function() {
    // set all required elements
    setFixtures('<video id="video" src="https://www.youtube.com/watch?v=pY1_HrhwaXU"></video><canvas id="canvas"></canvas><button id="playPauseBtn"></button><input id="seekCtrl" value="0"></input><div id="uiControls"></div><span id="currentTimeTxt"></span><button id="volumeBtn"></button><input id="volumeCtrl" value="0.5"></input><button id="zoomInBtn"></button><button id="zoomOutBtn"></button><input id="zoomCtrl" value="0"></input><button id="fullscreenBtn"></button>');
    // initialise variables
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    playPauseBtn = document.getElementById('playPauseBtn');
    uiControls = document.getElementById('uiControls');
    currentTimeTxt = document.getElementById('currentTimeTxt');
    totalTimeTxt = document.getElementById('totalTimeTxt');
    seekCtrl = document.getElementById('seekCtrl');
    volumeBtn = document.getElementById('volumeBtn');
    volumeCtrl = document.getElementById('volumeCtrl');
    zoomOutBtn = document.getElementById('zoomOutBtn');
    zoomCtrl = document.getElementById('zoomCtrl');
    zoomInBtn = document.getElementById('zoomInBtn');
    fullscreenBtn = document.getElementById('fullscreenBtn');
    // call function to create controls
    createCanvasControls(video, canvas, playPauseBtn, uiControls, currentTimeTxt, totalTimeTxt, seekCtrl, volumeBtn, volumeCtrl, zoomOutBtn, zoomCtrl, zoomInBtn, fullscreenBtn);
  });

  it("should not start playing video on load", function() {
    expect(video.paused).toBe(true);
  });

  it("should play video on clicking play button", function() {
    playPauseBtn.click();   // click to play video
    expect(video.paused).toBe(false);
  });

  it("should pause video on clicking pause button", function() {
    playPauseBtn.click();   // first click to play video
    playPauseBtn.click();   // second click to pause video
    expect(video.paused).toBe(true);
  });

  it("should not be mute on load", function() {
    expect(video.muted).toBe(false);
  });

  it("should mute video on clicking volume button", function() {
    volumeBtn.className = 'low';  // volume is low on load
    volumeBtn.click();  // click to mute video
    expect(video.muted).toBe(true);
  });

  it("should unmute video on clicking volume button again", function() {
    volumeBtn.className = 'low';  // volume is low on load
    volumeBtn.click();  // first click to mute video
    volumeBtn.click();  // second click to unmute video
    expect(video.muted).toBe(false);
  });

  it("should reflect the correct video volume on adjusting volume control", function() {
    var previousVolume = {
        state: '',
        value: 0
    };
    volumeCtrl.value = 0.8;   // set volume to be 0.8 using volume control
    volumeAdjust(previousVolume, video, volumeBtn, volumeCtrl);
    expect(video.volume).toBe(0.8);
  });
});

describe("Helper functions for video controls", function() {
  it("should convert seconds to hh:mm:ss format", function() {
    expect(convertSecondsToHMS(15)).toBe('0:00:15');    // convert seconds
    expect(convertSecondsToHMS(120)).toBe('0:02:00');   // convert seconds and minutes
    expect(convertSecondsToHMS(6333)).toBe('1:45:33');  // convert seconds, minutes and hours
  });
});