/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  models: {
  },

  /***************************************************************************
   * Set the port in the production environment to 443                        *
   ***************************************************************************/

  port: 443,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }

  appUrl: 'https://zoomable.pw',

  /***************************************************************************
  * Your SSL certificate and key, if you want to be able to serve HTTP      *
  * responses over https:// and/or use websockets over the wss:// protocol  *
  * (recommended for HTTP, strongly encouraged for WebSockets)              *
  *                                                                         *
  * In this example, we'll assume you created a folder in your project,     *
  * `config/ssl` and dumped your certificate/key files there:               *
  ***************************************************************************/
  ssl: {
    key: require('fs').readFileSync(__dirname + '/ssl/zoomable.pw.key'),
    cert: require('fs').readFileSync(__dirname + '/ssl/zoomable.pw.pem')
  },

  // Increase the hookTimeout to 50 seconds to prevent premature timeout
  // as minifying JS may take quite sometime
  hookTimeout: 50000, 

  // Redirect everything to HTTPS
  policies: {
    '*': 'isHTTPS'
  }
};
