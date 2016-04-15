/**
 * isHTTPS
 *
 * @module      :: Policy
 * @description :: Simple policy to redirect HTTP request to HTTPS
 * @docs        :: http://sailsjs.org/#!documentation/policies
 * @reference	:: http://www.procoefficient.com/blog/implementing-https-in-sailsjs-the-right-way/
 *
 */
module.exports = function(req, res, next) {
    if (req.secure) {
        // Already https; don't do anything special.
        next();
    } else {
        // Redirect to https.
        res.redirect('https://' + req.headers.host + req.url);
    }
};