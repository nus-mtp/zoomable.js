# zoomable.js [![Build Status][travis-image]][travis-url] 
## Overview
This is an open-source HTML5 video player that allows users to zoom in with greater detail and pan around the video with bandwith efficiency. The Javascript-based zoomable video player streams dash-compliant videos and adapts to network conditions to provide continuous video playback by reducing the video resolutions where necessary.

## Setup with Docker

### Install the necessary pre-requisites

- [Docker](https://www.docker.com/)

### Setup

To build the image:

```bash
$ sudo docker build -t <your-username>/<repository-name> 
```

Then run the built image:

```bash
$ sudo docker run -it -p 1337:1337 --entrypoint='bash' <yout-username>/<repository-name> 
```

## Setup without Docker

### Installing the necessary pre-requisites

#### The following packages are required for using zoomable.js:
- [Node.js](http://nodejs.org) 
- [Sails.js](http://sailsjs.org/get-started)
- [FFMPEG](https://ffmpeg.org/download.html) - For video conversion, thumnbnail generation
- [MP4Box](https://gpac.wp.mines-telecom.fr/downloads/) - For MPD creation for the videos

### Install necessary packages

Run the npm and bower install commands to install the packages that the project requires.

For bash:
```bash
$ npm install -g bower grunt-cli
$ npm install 
$ bower install 
```

### Additional Configurations

Make the video-processing script executable.
```
$ cd scripts
$ chmod +x video-processing.sh
```

## Start the Server for Development

Start the server by running the Sails command:
```
$ sails lift
```

If this server is setup locally, open your browser and enter the url: [http://localhost:1337](http://localhost:1337) to visit the main webpage of the project.

## Usage
`to be updated`


## Tests
[Mocha](https://mochajs.org/) and [PhantomJS](http://phantomjs.org/) are used for frontend and backend testing.

To run the full test suites:
```bash
$ grunt test
```


## Documentation
`to be updated`


## License
`to be updated`

[travis-image]: https://travis-ci.org/nus-mtp/zoomable.js.svg?branch=develop
[travis-url]: https://travis-ci.org/nus-mtp/zoomable.js
