/**
 * 409 (Conflict) Handler
 *
 * Usage:
 * res.emailAddressInUse();
 * 
 * @reference: https://github.com/irlnathan/activityoverlord20/blob/master/api/responses/emailAddressInUse.js
 */

module.exports = function emailAddressInUse (){

  // Get access to `res`
  // (since the arguments are up to us)
  var res = this.res;

  return res.send(409, 'Email address is already taken by another user.');
};