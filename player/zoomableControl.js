/**
 * Created by Nelson Goh on 4/11/15.
 */

/**
 * The application layer for the various player applications
 */

var zoomableApp = function() {
  ;
}

/**
 * A list of video elements owned by each video player
 * videoIDList is a list of player objects to video IDs so that app.js will know which document ID to get the video from
 */

var playerVidList = [];

zoomableApp.init = function() {

  var vidIdList = ["playerOne", "playerTwo", "playerThree", "playerFour", "playerFive", "playerSix", "playerSeven"]
  var tempPlayer = null;
  var tempVideo = null;

  // Getting all the player video elements on the web page
  // Player One of Twelve
  tempVideo = document.getElementById('playerOne');
  tempPlayer = new shaka.player.Player(tempVideo);
  var playerOne = new playerVidObj(tempPlayer, tempVideo);
  playerVidList.push(playerOne);

  // Player Two of Twelve
  tempVideo = document.getElementById('playerTwo');
  tempPlayer = new shaka.player.Player(tempVideo);
  var playerTwo = new playerVidObj(tempPlayer, tempVideo);
  playerVidList.push(playerTwo);

  // Player Three of Twelve
  tempVideo = document.getElementById('playerThree');
  tempPlayer = new shaka.player.Player(tempVideo);
  var playerThree = new playerVidObj(tempPlayer, tempVideo);
  playerVidList.push(playerThree);

  // Player Four of Twelve
  tempVideo = document.getElementById('playerFour');
  tempPlayer = new shaka.player.Player(tempVideo);
  var playerFour = new playerVidObj(tempPlayer, tempVideo);
  playerVidList.push(playerFour);

  // Player Five of Twelve
  tempVideo = document.getElementById('playerFive');
  tempPlayer = new shaka.player.Player(tempVideo);
  var playerFive = new playerVidObj(tempPlayer, tempVideo);
  playerVidList.push(playerFive);

  // Player Six of Twelve
  tempVideo = document.getElementById('playerSix');
  tempPlayer = new shaka.player.Player(tempVideo);
  var playerSix = new playerVidObj(tempPlayer, tempVideo);
  playerVidList.push(playerSix);

  // Player Seven of Twelve
  tempVideo = document.getElementById('playerSeven');
  tempPlayer = new shaka.player.Player(tempVideo);
  var playerSeven = new playerVidObj(tempPlayer, tempVideo);
  playerVidList.push(playerSeven);

  // Player Eight of Twelve
  tempVideo = document.getElementById('playerEight');
  tempPlayer = new shaka.player.Player(tempVideo);
  var playerEight = new playerVidObj(tempPlayer, tempVideo);
  playerVidList.push(playerEight);

  // Player Nine of Twelve
  tempVideo = document.getElementById('playerNine');
  tempPlayer = new shaka.player.Player(tempVideo);
  var playerNine = new playerVidObj(tempPlayer, tempVideo);
  playerVidList.push(playerNine);

  // Player Ten of Twelve
  tempVideo = document.getElementById('playerTen');
  tempPlayer = new shaka.player.Player(tempVideo);
  var playerTen = new playerVidObj(tempPlayer, tempVideo);
  playerVidList.push(playerTen);

  // Player Eleven of Twelve
  tempVideo = document.getElementById('playerEleven');
  tempPlayer = new shaka.player.Player(tempVideo);
  var playerEleven = new playerVidObj(tempPlayer, tempVideo);
  playerVidList.push(playerEleven);

  // Player Twelve of Twelve
  tempVideo = document.getElementById('playerTwelve');
  tempPlayer = new shaka.player.Player(tempVideo);
  var playerTwelve = new playerVidObj(tempPlayer, tempVideo);
  playerVidList.push(playerTwelve);

}

zoomableApp.initPlayer = function() {

  console.assert(zoomableApp.player == null);

}

/**
 * An object constructor to hold the player object and a video ID as per the video tag in the HTML
 * @param playerObj
 * @param vidId
 */

function playerVidObj(playerObj, vidId) {
  this.player = playerObj;
  this.videoId = vidId;
}
