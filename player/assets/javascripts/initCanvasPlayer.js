/* Initialise variables for creating canvas controls on DOM loaded */
document.addEventListener('DOMContentLoaded', function() {  // create an anonymous function
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
    var fullscreenBtn = document.getElementById('fullscreenBtn');
    createCanvasControls(v, canvas, playPauseBtn, uiControls, currentTimeTxt, totalTimeTxt, seekCtrl, volumeBtn, volumeCtrl, zoomOutBtn, zoomCtrl, zoomInBtn, fullscreenBtn);
}, false);
