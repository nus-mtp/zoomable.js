# UPDATE THIS PATH IN YOUR SERVER
#!/usr/local/bin/bash

# Credits to:
# http://www.unix.com/shell-programming-and-scripting/136694-automated-ffmpeg-convert-bash-script.html
# http://superuser.com/questions/538112/meaningful-thumbnails-for-a-video-using-ffmpeg
# http://blog.streamroot.io/encode-multi-bitrate-videos-mpeg-dash-mse-based-media-players-22/

# Written by Nelson Goh Wei Qiang (A0111014J)
# This script will be executed on the server side to automate the cropping and changing the resolution of videos into
# the respective 360p, 480p, 720p and 1080p resolutions

# Directory on the server where uploaded videos go to
srclocation=$*
# Extensions recognizable by FFMPEG and that can be processed
srcext_mp4=".mp4"
srcext_mov=".mov"
# Final output format type
finalformat=".mp4"
# The slash character
slash="/"
# The 'R' character
r="_R"
# The 'C' character
c="C"

# Looking for a file that ends in .mp4 and executes the FFMPEG commands to commence processing
# Retrieve the video's directory location, including its name (e.g. /usr/bin/test.txt)
# ASSUMPTION: There is only 1 file in that directory with that specified extension
vidloc=$(find "${srclocation}" -iname "*${srcext_mp4}" -o -iname "*${srcext_mov}")
# Retrieve the parent directory of this file
parentdir=$(dirname $vidloc)
# Strip out the leading directory prefixes infront of the filename
vidname_and_ext=$(basename "$vidloc")
# Retrieve the file extension type
srcext=".""${vidname_and_ext##*.}"
# Pure filename without the extension type
vidname=$(basename "$vidname_and_ext" ${srcext})

# 360p video details
# Additional name identifier for the video in 360p format
_360p_ext="_360p"
# 360p cropped video width
_360p_crop_w=120
# 360p cropped video height
_360p_crop_h=120
# 360p FFMPEG conversion command
_360p_cmd() {
	ffmpeg -i ${parentdir}${slash}${vidname_and_ext} -c:v libx264 -crf 23 -vf scale=480x360 -x264opts keyint=48:min-keyint=48:no-scenecut -movflags +faststart -preset slow -profile:v high -an ${parentdir}${slash}${vidname}${_360p_ext}${finalformat}
}

# 480p video details
# Additional name identifier for the video in 480p format
_480p_ext="_480p"
# 480p cropped video width
_480p_crop_w=160
# 480p cropped video height
_480p_crop_h=160
# 480p FFMPEG conversion command
_480p_cmd() {
	ffmpeg -i ${parentdir}${slash}${vidname_and_ext} -c:v libx264 -crf 23 -vf scale=640x480 -x264opts keyint=48:min-keyint=48:no-scenecut -movflags +faststart -preset slow -profile:v high -an ${parentdir}${slash}${vidname}${_480p_ext}${finalformat}
}

# 720p video details
# Additional name identifier for the video in 720p format
_720p_ext="_720p"
# 720p cropped video width
_720p_crop_w=320
# 720p cropped video height
_720p_crop_h=240
# 720p FFMPEG conversion command
_720p_cmd() {
	ffmpeg -i ${parentdir}${slash}${vidname_and_ext} -c:v libx264 -crf 23 -vf scale=1280x720 -x264opts keyint=48:min-keyint=48:no-scenecut -movflags +faststart -preset slow -profile:v high -an ${parentdir}${slash}${vidname}${_720p_ext}${finalformat}
}

# 1080p video details
# Additional name identifier for the video in 1080p format
_1080p_ext="_1080p"
# 1080p cropped video width
_1080p_crop_w=480
# 1080p cropped video height
_1080p_crop_h=360
# 1080p FFMPEG conversion command
_1080p_cmd() {
	ffmpeg -i ${parentdir}${slash}${vidname_and_ext} -c:v libx264 -crf 23 -vf scale=1920x1080 -x264opts keyint=48:min-keyint=48:no-scenecut -movflags +faststart -preset slow -profile:v high -an ${parentdir}${slash}${vidname}${_1080p_ext}${finalformat}
}

# Create an array of possible resolutions to convert to
declare -a resArr
resArr[1]=${_360p_ext}
resArr[2]=${_480p_ext}
resArr[3]=${_720p_ext}
resArr[4]=${_1080p_ext}

# Create an array of cropped widths for each corresponding resolution
declare -a cropWidthArr
cropWidthArr[1]=${_360p_crop_w}
cropWidthArr[2]=${_480p_crop_w}
cropWidthArr[3]=${_720p_crop_w}
cropWidthArr[4]=${_1080p_crop_w}

# Create an array of cropped heights for each corresponding resolution
declare -a cropHeightArr
cropHeightArr[1]=${_360p_crop_h}
cropHeightArr[2]=${_480p_crop_h}
cropHeightArr[3]=${_720p_crop_h}
cropHeightArr[4]=${_1080p_crop_h}

# Create an array of commands for each corresponding resolution
declare -a cmdArr
cmdArr[1]=_360p_cmd
cmdArr[2]=_480p_cmd
cmdArr[3]=_720p_cmd
cmdArr[4]=_1080p_cmd

# Initalizing the variables to track the (x,y) coordinates of the row and column for the cropped video
x_coord=0
y_coord=0

# For each resolution
for i in {1..4}
do
	# Run the resolution conversion command pertaining to that given resolution
	${cmdArr[$i]}

	# Crop the video into its respection 4:3 parts
	# For each column
	for col in {1..4}
	do
		y_coord=0
		# For each row
		for row in {1..3}
		do
			ffmpeg -i ${parentdir}${slash}${vidname}${resArr[$i]}${finalformat} -filter:v "crop=${cropWidthArr[$i]}:${cropHeightArr[$i]}:${x_coord}:${y_coord}" ${parentdir}${slash}${vidname}${resArr[$i]}${r}${row}${c}${col}${finalformat}
			y_coord=$((y_coord + cropHeightArr[$i]))
		done
		x_coord=$((x_coord + cropWidthArr[$i]))
	done
	x_coord=0
	y_coord=0
done

# Generate the thumbnail for the video
# Defined thumbnail size
tn_size="640:360"
# Defined thumbnail format
tn_format=".png"
# Generating the actual thumbnail
ffmpeg -i ${parentdir}${slash}${vidname_and_ext} -vf  "thumbnail,scale=${tn_size}" -frames:v 1 ${parentdir}${slash}${vidname}${tn_format}

# Generate the audio file of the video
# Defined audio format
aud_format=".mp3"
# Generating the actual audio file of the video
ffmpeg -i ${parentdir}${slash}${vidname_and_ext} -c:a libmp3lame -q:a 4 ${parentdir}${slash}${vidname}${aud_format}

# Create the MPD file for each player (12 in total), comprising of the 360p, 480p, 720p and 1080p versions
# NOTE: The MPD files do not contain any links to audio, as the audio stream will be separate from the video
# MPD extension type
mpd_ext=".mpd"
# Name identifier for the Media Presentation Description (MPD)
mpd_name="_mpd"
# For each column
for i in {1..4}
do
	# For each row
	for j in {1..3}
	do
		MP4Box -dash 10000 -rap -frag-rap -profile dashavc264:onDemand -out ${parentdir}${slash}${vidname}${r}${j}${c}${i}${mpd_ext} ${parentdir}${slash}${vidname}${_360p_ext}${r}${j}${c}${i}${finalformat}#video ${parentdir}${slash}${vidname}${_480p_ext}${r}${j}${c}${i}${finalformat}#video ${parentdir}${slash}${vidname}${_720p_ext}${r}${j}${c}${i}${finalformat}#video ${parentdir}${slash}${vidname}${_1080p_ext}${r}${j}${c}${i}${finalformat}#video
	done
done

# Delete the original uploaded video
rm ${parentdir}${slash}${vidname_and_ext}
