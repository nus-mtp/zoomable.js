function initShakaPlayer() {
  // Install polyfills.
  shaka.polyfill.installAll();

  // Find the video element.
  var video = document.getElementById('video');

  // Construct a Player to wrap around it.
  var player = new shaka.player.Player(video);

  // Attach the player to the window so that it can be easily debugged.
  window.player = player;

  // Listen for errors from the Player.
  player.addEventListener('error', function(event) {
    console.error(event);
  });

  // Construct a DashVideoSource to represent the DASH manifest.
  var mpdUrl = $('#mpdSource').val();
  var estimator = new shaka.util.EWMABandwidthEstimator();
  var source = new shaka.player.DashVideoSource(mpdUrl, null, estimator);

  // Load the source into the Player.
  player.load(source);
}