/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 *              :: https://github.com/irlnathan/activityoverlord20/blob/master/api/controllers/UserController.js
 */

var Passwords = require('machinepack-passwords');

module.exports = {

  /**
   * `UserController.login()`
   */
  login: function (req, res) {
    // Look for user using given username
    User.findOne({
      username: req.param('username')
    }, function foundUser(err, user) {
      if (err) return res.negotiate(err);
      if (!user) return res.notFound();

      Passwords.checkPassword({
        passwordAttempt: req.param('password'),
        encryptedPassword: user.encryptedPassword
      }).exec({
        // An unexpected error occurred.
        error: function (err) {
          return res.negotiate(err);
        },

        // If the password attempted is different from stored encrypted password
        incorrect: function () {
          return res.notFound();
        },

        success: function () {
          // Store user id in the user session
          req.session.me = user.id;

          // All working, let the client know everything worked
          return res.ok();
        }
      });
    });
  },


  /**
   * `UserController.signup()`
   */
  signup: function (req, res) {
    return res.json({
      todo: 'signup() is not implemented yet!'
    });
  },

  /**
   * `UserController.logout()`
   */
  logout: function (req, res) {
    return res.json({
      todo: 'logout() is not implemented yet!'
    });
  },

  /**
   * `UserController.updatePassword()`
   */
  updatePassword: function (req, res) {
    return res.json({
      todo: 'updatePassword() is not implemented yet!'
    });
  }
};

