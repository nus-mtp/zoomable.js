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
  },

  /**
   * `VideoController.uploadVideo()`
   * Usage: POST /api/video/uploadVideo
   * Content: {id: ':id', video: 'attach video file here'}
  **/
  uploadVideo: function (req, res) {
    req.file('video').upload({
      dirname: sails.config.appPath + '/vid/' + req.param('id')
    }, function (err, uploadedFiles) {
      if (err) return res.negotiate(err); 
      
      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }

      // Update the Video Model's videoDir based on the video ID
      Video.update({
        id: req.param('id')
      },  {
        videoDir: uploadedFiles[0].fd
      }).exec(function (err, updatedVideo) {
        return res.json({
          message: uploadedFiles.length + ' file(s) uploaded successfully!',
          // Only upload 1 video per time
          files: uploadedFiles[0],
          textParams: req.params.all(),
          video: updatedVideo[0]
        });
      });
      
    });
  }
};

