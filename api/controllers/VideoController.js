/**
 * VideoController
 *
 * @description :: Server-side logic for managing videos
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
  /**
   * `VideoController.create()`
   */
  create: function (req, res) {
    Video.create(req.body).exec(function (err, video) {
      if (err) throw err;
      res.json(video);
    });
  },

  /**
   * `VideoController.read()`
   */
  read: function (req, res) {
    Video.find(req.body).exec(function (err, video) {
      if (err) throw err;
      res.json(video);
    });
  },

  /**
   * `VideoController.readAll()`
   */
  readAll: function (req, res) {
    Video.find().exec(function (err, videos) {
      if (err) throw err;
      res.json(videos);
    });
  },

  /**
   * `VideoController.destroy()`
   */
  destroy: function (req, res) {
    Video.destroy(req.body.id).exec(function (err, video) {
      console.log(req.body.videoId);
      if (err) throw err;
      res.json(video);
    });
  },


  /**
   * `VideoController.update()`
   */
  update: function (req, res) {
    Video.update(req.body.id, req.body).exec(function (err, updated) {
      console.log(req.body);
      if (err) throw err;
      res.json(updated);
    });
  },


  /**
   * `VideoController.tags()`
   */
  tags: function (req, res) {
    return res.json({
      todo: 'tags() is not implemented yet!'
    });
  }
};

