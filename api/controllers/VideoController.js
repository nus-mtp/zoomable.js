/**
 * VideoController
 *
 * @description :: Server-side logic for managing videos
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var isDoneProcessing = [];

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
   * `VideoController.upload()`
   * Usage: POST /api/video/upload
   * Content: {id: ':id', video: 'attach video file here'}
  **/
  upload: function (req, res) {
    req.file('video').upload({
      dirname: sails.config.appPath + '/.tmp/public/upload/vid/' + req.param('id'),
      // maximum size of 2GB
      maxBytes: 2 * 1000 * 1000 * 1000
    }, function (err, uploadedFiles) {
      if (err) return res.negotiate(err);

      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }

      // generate a list of mpd dir
      var mpdArray = [];
      var postfix = ["R1C1", "R1C2", "R1C3", "R1C4", "R2C1", 
                    "R2C2", "R2C3", "R2C4", "R3C1", "R3C2", "R3C3", "R3C4"];
      for (var i = 0; i < postfix.length; i++) {
        mpdArray.push(uploadedFiles[0].fd + "_" + postfix[i] + ".mpd");
      }

      // Update the Video Model's videoDir based on the video ID
      Video.update({
        id: req.param('id')
      },  {
        videoDir: uploadedFiles[0].fd,
        mpdDir: mpdArray,
        thumbnailDir: uploadedFiles[0].fd + ".png"
      }).exec(function (err, updatedVideo) {
        // Push into array of isDoneProcessing
        isDoneProcessing.push({
          id: req.param('id'), 
          status: false
        });

        // run the video processing service
        VideoProcessingService.run({id: req.param('id'), filename: uploadFiles[0]});

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
    for (var i = 0; i < isDoneProcessing.length; i++) {
      if (id == isDoneProcessing[i].id) {
        return res.json({
          status: isDoneProcessing[i].status
        });
      }
    }

    // return 404 not found if the id doesnt exists
    res.notFound(); 
  }
  
};
