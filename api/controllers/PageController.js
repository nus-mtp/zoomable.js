/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 * 					https://github.com/irlnathan/activityoverlord20/blob/master/api/controllers/PageController.js
 */

module.exports = {

	showHomePage: function (req, res) {

    // If not logged in, show the public view.
    if (!req.session.me) {
      return res.view('homepage', {
        user: [],
        video: []
      });
    }

    // Otherwise, look up the logged-in user and show the logged-in view,
    // bootstrapping basic user data in the HTML sent from the server
    User.findOne(req.session.me, function (err, user){
      if (err) {
        return res.negotiate(err);
      }

      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists- did you delete a user, then try to refresh the page with an open tab logged-in as that user?');
        return res.view('homepage', {
          user: [],
          video: []
        });
      }

      // returned filtered user object
      var userObj = {
        username: user.username,
        email: user.email
      };
      return res.view('dashboard', {
        user: userObj,
        video: []
      });

    });
  },

	showEditPage: function (req, res) {

    // If not logged in, show the public view.
    if (!req.session.me) {
			return res.view('homepage', {
        user: [],
        video: []
      });
    }

    // Otherwise, look up the logged-in user and show the logged-in view,
    // bootstrapping basic user data in the HTML sent from the server
    User.findOne(req.session.me, function (err, user){
      if (err) {
        return res.negotiate(err);
      }

      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists- did you delete a user, then try to refresh the page with an open tab logged-in as that user?');
        return res.view('homepage', {
          user: [],
          video: []
        });
      }

			// retreive the video object using the id
      Video.findOne(req.param('id'), function(err, video){
        if (err) {
          // return error
        }

        // if successful, return filtered user and video object to frontend
        var userObj = {
          username: user.username,
          email: user.email
        };
        return res.view('edit', {
          user: userObj,
          video: video
        });

      });
    });
  },

  showPlayerPage: function (req, res) {
      return res.view('fullplayer', {
        user: [],
        video: []
      });
  },

	showStatPage: function (req, res) {

    // If not logged in, show the public view.
    if (!req.session.me) {
      return res.view('homepage', {
        user: [],
        video: []
      });
    }

    // Otherwise, look up the logged-in user and show the logged-in view,
    // bootstrapping basic user data in the HTML sent from the server
    User.findOne(req.session.me, function (err, user){
      if (err) {
        return res.negotiate(err);
      }

      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists- did you delete a user, then try to refresh the page with an open tab logged-in as that user?');
        return res.view('homepage', {
          user: [],
          video: []
        });
      }

      // returned filtered user object
      var userObj = {
        username: user.username,
        email: user.email
      };
      return res.view('statistic', {
        user: userObj,
        video: []
      });

    });
  }
};
