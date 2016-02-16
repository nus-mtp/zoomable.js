/**
 * VideoController
 *
 * @description :: Server-side logic for managing videos
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
  /**
   * `VideoController.create()`
   * Usage: POST /api/video
   */
  create: function (req, res) {
    Video.create(req.body).exec(function (err, video) {
      if (err) throw err;
      res.json(video);
    });
  },

  /**
   * `VideoController.read()`
   * Usage: GET /api/video/:id
   */
  read: function (req, res) {
    Video.findOne({
      id: req.param('id')
    }).exec(function (err, video) {
      if (err) throw err;
      res.json(video);
    });
  },

  /**
   * `VideoController.readAll()`
   * Usage: GET /api/video
   */
  readAll: function (req, res) {
    Video.find().exec(function (err, videos) {
      if (err) throw err;
      res.json(videos);
    });
  },

  /**
   * `VideoController.destroy()`
   * Usage: DELETE /api/video/:id
   */
  destroy: function (req, res) {
    Video.destroy({
      id: req.param('id')
    }).exec(function (err, video) {
      if (err) throw err;
      res.json(video);
    });
  },


  /**
   * `VideoController.update()`
   * Usage: PUT /api/video/:id
   */
  update: function (req, res) {
    Video.update({
      id: req.param('id')
    }, req.body).exec(function (err, updated) {
      if (err) throw err;
      res.json(updated);
    });
  },


  /**
   * `VideoController.tags()`
   * Usage: 
   */
  tags: function (req, res) {
    return res.json({
      todo: 'tags() is not implemented yet!'
    });
  },

  /**
   * `VideoController.getVideo()`
   * Usage: POST /api/video/getVideo
   * Content: {id: ':id'}
   */
  getVideo: function (req, res) {
    Video.findOne({
      id: req.param('id')
    }).exec(function (err, video) {
      if (err) throw err;
      res.json(video.videoDir);
    });
  }
};

