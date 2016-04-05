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
    if (!req.body.sessionId || !req.body.videoId || !req.body.coordinates || !req.body.width || !req.body.videoTime) {
      return res.json({
        error: 'Required fields are not entered.'
      });
    }

    // need video id, check if videoId exist
    Video.findOne({
      id: req.body.videoId
    }).exec(function (err, video) {
      if (err) throw err;

      if (!video) {
        // no matched video id, return video not found
        return res.status(404).notFound('VideoNotFound');
      }

      // create a new session if sessionId does not exist
      ViewSession.findOne({
        sessionId: req.body.sessionId
      }).exec(function (err, session) {
        if (err) throw err;

        if (!session) {
          // no matched session id, create a new view session first
          ViewSession.create({
            sessionId: req.body.sessionId,
            videoId: req.body.videoId
          }).exec(function (err, session) {
            if (err) throw err;
            // create viewData object and update into ViewSession
            createViewData(session, req, res);
          });
        }
        else {
          // a match, create viewData object and update into ViewSession
          createViewData(session, req, res);
        }
      });
    });
  },

  /**
   * `ViewSessionController.getVideoStat()`
   * Usage: GET /api/viewsession/getVideoStat/:id
   * Description: Get list of video data for specified video id
   */
  getVideoStat: function (req, res) {
    ViewSession.find({
      videoId: req.param('id')
    }).populate('viewLogs').exec(function (err, sessions) {
      if (err) return res.negotiate(err);

      if (!sessions) {
        // no session for matched video id, return empty array
        return res.json([]);
      }

      // get viewdata objects
      var viewDataList = [];
      sessions.forEach(function (session) {
        session.viewLogs.forEach(function (viewdata) {
          viewDataList.push(viewdata);
        })
      });
      return res.json(viewDataList);
    })
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
