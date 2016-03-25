/**
 * ViewSessionController
 *
 * @description :: Server-side logic for managing video view sessions to calculate statistics
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * Default routes generated using blueprints
   * :::::::::::::::::::::::::::::::::::::::::::::::::::::::
   *  GET /viewsession -> Returns all the view sessions
   *  GET /viewsession/:id -> Returns view session with specified id
   *  DELETE /viewsession/:id -> Delete and returns the view session with specified id
   */


  // List of overridden and custom routes

  /**
   * `ViewSessionController.create()`
   * Usage: POST /api/viewsession
   * Description: Create a video view session for the specified video
   */
  create: function (req, res) {
    // need video id, check if videoId exist
    Video.findOne({
      id: req.body.videoId
    }).exec(function (err, video) {
      if (err) throw err;

      if (video === undefined) {
        // create a new session if sessionId does not exist
        ViewSession.findOne({
          sessionId: req.body.sessionId
        }).exec(function (err, session) {
          if (err) throw err;

          if (session === undefined) {
            // if not found, create a new session first
            ViewSession.create({
              sessionId: req.body.sessionId,
              videoId: req.body.videoId
            }).exec(function (err, session) {
              if (err) throw err;
              // create viewData object and update into ViewSession
              createViewData(session, req, res);
            });
          }

          // if found, create viewData object and update into ViewSession
          else {
            createViewData(session, req, res);
          }
        });
      }
      else {
        // no matched video id, return video not found
        return res.status(404).json({ error: 'VideoNotFound' });
      }
    });
  }

};


// List of common functions

/* Function to create view data object */
function createViewData(session, req, res) {
  ViewData.create({
    coordinates: req.body.coordinates,
    width: req.body.width,
    videoTime: req.body.videoTime,
    sessionObj: session.id
  }).exec(function (err, data) {
    if (err) throw err;
    res.json(data);
  });
};
