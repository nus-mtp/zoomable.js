/**
 * VideoController
 *
 * @description :: Server-side logic for managing videos
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var path = require('path');

module.exports = {

  /**
   * `VideoController.create()`
   * Usage: POST /api/video
   */
  create: function (req, res) {
    Video.create({
      title: req.param('title'),
      ownedBy: req.session.me
    }).exec(function (err, video) {
      if (err) return res.negotiate(err);
      return res.json(video);
    });
  },

  /**
   * `VideoController.findOne()`
   * Usage: GET /api/video/:id
   */
  findOne: function (req, res) {
    Video.findOne({
      id: req.param('id'),
      ownedBy: req.session.me
    }).exec(function (err, video) {
      if (err) return res.negotiate(err); 
      if (video == undefined) return res.notFound();
      return res.json(video);
    })
  },

  /**
   * `VideoController.find()`
   * Usage: GET /api/video
   */
  find: function (req, res) {
    Video.find({
      ownedBy: req.session.me
    }).exec(function (err, video) {
      if (err) return res.negotiate(err);
      if (video.length == 0) return res.notFound();
      return res.json(video);
    })
  },

  /**
   * `VideoController.destroy()`
   * Usage: DELETE /api/video/:id
   */
  destroy: function (req, res) {
    Video.destroy({
      id: req.param('id'),
      ownedBy: req.session.me
    }).exec(function (err, video) {
      if (err) return res.negotiate(err);
      if (video.length == 0) return res.notFound();
      return res.json(video);
    });
  },

  /**
   * `VideoController.destroyAll()`
   * Usage: DELETE /api/video/
   * Content: {id: [:id]}
   */
   destroyAll: function(req, res) {
    Video.destroy({
      id: req.param('id'), 
      ownedBy: req.session.me
    }).exec(function (err, deletedVideos) {
      if (err) return res.negotiate(err);
      if (deletedVideos.length == 0) return res.notFound();
      return res.json(deletedVideos);
    });
   },

  /**
   * `VideoController.update()`
   * Usage: PUT /api/video/:id
   */
  update: function (req, res) {
    Video.update({
      id: req.param('id'),
      ownedBy: req.session.me
    }, req.body).exec(function (err, updated) {
      if (err) return res.negotiate(err);
      return res.json(updated);
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
      if (err) return res.negotiate(err);
      return res.json(video.videoDir);
    });
  },

  /**
   * `VideoController.upload()`
   * Usage: POST /api/video/upload
   * Content: {id: ':id', video: 'attach video file here'}
  **/
  upload: function (req, res) {
    req.file('video').upload({
      dirname: sails.config.appPath + '/.tmp/public/upload/vid/' + req.param('id'),
      // maximum size of 2GB
      maxBytes: 2 * 1000 * 1000 * 1000,
      // save as id + file extension
      saveAs: function(_newFileStream, cb) {
        cb(null, req.param('id') + path.extname(_newFileStream.filename))
      }
    }, function (err, uploadedFiles) {
      if (err) return res.negotiate(err);

      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }

      // generate a list of mpd dir
      var fdWithExtension = sails.getBaseUrl() + uploadedFiles[0].fd.split('/public')[1];
      var fd = fdWithExtension.substr(0, fdWithExtension.lastIndexOf('.')) || fdWithExtension;

      var mpdArray = [];
      var postfix = ["R1C1", "R1C2", "R1C3", "R1C4", "R2C1",
                    "R2C2", "R2C3", "R2C4", "R3C1", "R3C2", "R3C3", "R3C4"];
      for (var i = 0; i < postfix.length; i++) {
        mpdArray.push(fd + "_" + postfix[i] + ".mpd");
      }

      // Update the Video Model's videoDir based on the video ID
      Video.update({
        id: req.param('id')
      },  {
        videoDir: fdWithExtension,
        mpdDir: mpdArray,
        thumbnailDir: fd + ".png"
      }).exec(function (err, updatedVideo) {
        // Push into array of isDoneProcessing
        sails.isDoneProcessing.push({
          id: req.param('id'),
          status: false
        });

        // run the video processing service
        VideoProcessingService.run({id: req.param('id'), dir: fdWithExtension});

        return res.json({
          message: uploadedFiles.length + ' file(s) uploaded successfully',
          // Only upload 1 video per time
          files: uploadedFiles[0],
          textParams: req.params.all(),
          video: updatedVideo[0]
        });
      });
    });
  },

  /**
   * `VideoController.isComplete()`
   * Usage: POST /api/video/isComplete
   * Content: {id: ':id'}
  **/
  isComplete: function (req, res) {
    var id = req.param("id");
    for (var i = 0; i < sails.isDoneProcessing.length; i++) {
      if (id == sails.isDoneProcessing[i].id) {
        return res.json({
          status: sails.isDoneProcessing[i].status
        });
      }
    }

    // return 404 not found if the id doesnt exists
    return res.notFound();
  }

};
