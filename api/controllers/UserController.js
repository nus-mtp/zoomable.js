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
      if (!user) {
        // prompt incorrect credentials error to prevent hackers from trying to guess password combination
        return res.send(401, 'Incorrect username/password. Please try again.');
      }

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
          return res.send(401, 'Incorrect username/password. Please try again.');
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
    if (req.param('username').length < 6 || req.param('password').length < 6) {
      // prompt error if username and password is less than 6 characters
      return res.send(400, 'LengthNotSatisfied');
    }

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
    // Handle the case when logout is called when not signed in
    if (!req.session.me) return res.backToHomePage();

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
  },

  /**
   * `UserController.getInfo()`
   * Usage: GET /api/user/getAccountDate
   */
  getAccountDate: function (req, res) {
    // Handle the case when no user is signed in
    if (!req.session.me) {
      return res.status(401).forbidden('NoPermission');
    }

    // Look up the user record from the database which is
    // referenced by the id in the user session (req.session.me)
    User.findOne(req.session.me).exec(function foundUser(err, user) {
      if (err) return res.negotiate(err);

      // no matched user, return user not found
      if (!user) {
        return res.status(404).notFound('UserNotFound');
      }

      // only return user account creation date
      return res.json({
        createdDate: user.createdAt
      });

    });
  }
};
