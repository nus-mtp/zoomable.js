# zoomable.js [![Build Status][travis-image]][travis-url] 
This is an open-source HTML5 video player that allows users to zoom in with greater detail and pan around the video with bandwith efficiency. The Javascript-based zoomable video player streams dash-compliant videos and adapts to network conditions to provide continuous video playback by reducing the video resolutions where necessary.

## Installation

### Step 1: Cloning the project

Pull a copy of this project from GitHub (link above) or download the project as a zipped folder (Download ZIP above) to your computer.

### Step 2: Installing the necessary pre-requisites

#### The following packages are required for using zoomable.js:
[Node.js](http://nodejs.org) - For package installation
[Grunt](http://gruntjs.com/) - For generating front-end assets
[Bower](http://www.npmjs.com/package/bower) - For package installation
[Sails.js](http://sailsjs.org/get-started) - For server creation
[FFMPEG](https://ffmpeg.org/download.html) - For video conversion, thumnbnail generation
[MP4Box](https://gpac.wp.mines-telecom.fr/downloads/) - For MPD creation for the videos

### Step 3: Install additional dependencies and libraries

Run the npm and bower install commands to install the dependencies and libraries that the project requires. These dependencies and libraries are indicated inside package.json (for npm install) and bower.json (for bower install).

For bash:
```
$ npm install 
$ bower install 
```

### Step 4: Generate latest front-end assets

Run the Grunt command to update the changes made to the front-end assets and compile it for further use later.
```
$ grunt
```
Make the video-processing script executable.
```
$ cd scripts
$ chmod +x video-processing.sh
```

### Step 5: Starting the server

Start the server by running the Sails command:
```
$ sails lift
```

If this server is setup locally, open your browser and enter the url: [http://localhost:1337](http://localhost:1337) to visit the main webpage of the project.

## Usage
`to be updated`


## Tests
`to be updated`


## Documentation
`to be updated`


## License
`to be updated`

[travis-image]: https://travis-ci.org/nus-mtp/zoomable.js.svg?branch=develop
[travis-url]: https://travis-ci.org/nus-mtp/zoomable.js
