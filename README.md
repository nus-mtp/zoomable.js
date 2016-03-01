# zoomable.js [![Build Status][travis-image]][travis-url] 
This is an open-source HTML5 video player that allows users to zoom in with greater detail and pan around the video with bandwith efficiency. The Javascript-based zoomable video player streams dash-compliant videos and adapts to network conditions to provide continuous video playback by reducing the video resolutions where necessary.

## Installation

### Step 1: Cloning the project

Pull a copy of this project from GitHub (link above) or download the project as a zipped folder (Download ZIP above) to your computer.

### Step 2: Installing the necessary pre-requisites

Note: Some of these commands may require permissions to install the relevant packages. As such adding 'sudo' before the actual command (e.g. npm) may help.

#### Install Node.js on your machine

[Node.js](http://nodejs.org)

Install Node.js from https://nodejs.org/en/download/

If you have Homebrew installed on your machine (e.g. Mac OSX):
```bash
$ brew install node
```
OR

If the MSI installer option is available for your OS:
Download the MSI installer from the Node.js website and run the installer

#### Redirecting the directory

Change the current working directory from the command-line interface to that of the project folder

For example (Terminal on Mac OSX):
```bash
$ cd Desktop\zoomable.js
```

#### Install Grunt

[Grunt](http://gruntjs.com/)

Run the Node Package Manager (npm) installation command for the Grunt package:
```bash
$ npm install -g grunt-cli
``` 

#### Install Bower

[Bower](http://www.npmjs.com/package/bower)

and the Bower package:
```bash
$ npm install -g bower
```

#### Install Sails.js

[Sails.js](http://sailsjs.org/get-started)

as well as the Sails.js package:
```bash
$ npm install -g sails
```

### Setup

Install the necessary packages.

```bash
$ npm install 
$ bower install 
```

### Task Automation

Generate frontend assets using Grunt.

```bash
$ grunt
```

### Start server

Run on http://localhost:1337 .

```bash
$ sails lift
```

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
