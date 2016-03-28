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
   * Usage: POST /api/user/login
   * Content: {username: ':username', password: ':password'}
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
          req.session.username = user.username;

          // All working, let the client know everything worked
          return res.ok();
        }
      });
    });
  },


  /**
   * `UserController.signup()`
   * Usage: POST /api/user/signup
   * Content: {username: ':username', password: ':password', email: ':emailaddress'}
   */
  signup: function (req, res) {
    Passwords.encryptPassword({
      // Encrypt with BCrypt algo
      password: req.param('password'),
      difficulty: 10,
    }).exec({
      error: function(err) {
        return res.negotiate(err);
      },

      success: function(encryptedPassword) {
        User.create({
          username: req.param('username'),
          encryptedPassword: encryptedPassword,
          email: req.param('email')
        }).exec(function(err, newUser) {
          if (err) {
            console.log("err: ", err);
            console.log("err.invalidAttributes: ", err.invalidAttributes);

            // If this is a uniqueness error about the email attribute,
            // send back an easily parseable status code.
            if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0]
              && err.invalidAttributes.email[0].rule === 'unique') {
                return res.emailAddressInUse();
            }

            return res.negotiate(err);
          }

          // Log user in
          req.session.me = newUser.id;

          // Send back the id of the new user
          return res.json({
            id: newUser.id
          });
        });
      },
    });
  },

  /**
   * `UserController.logout()`
   * Usage: GET /api/user/logout
   */
  logout: function (req, res) {
    // Look up the user record from the database which is
    // referenced by the id in the user session (req.session.me)
    User.findOne(req.session.me, function foundUser(err, user) {
      if (err) return res.negotiate(err);

      // If session refers to a user who no longer exists, still allow logout.
      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists.');
        return res.backToHomePage();
      }

      // Wipe out the session (log out)
      req.session.me = null;

      // Either send a 200 OK or redirect to the home page
      return res.backToHomePage();

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

