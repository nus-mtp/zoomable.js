# UPDATE THIS PATH IN YOUR SERVER
#!/usr/local/bin/bash

# Credits to: 
# http://www.unix.com/shell-programming-and-scripting/136694-automated-ffmpeg-convert-bash-script.html
# http://superuser.com/questions/538112/meaningful-thumbnails-for-a-video-using-ffmpeg

# Written by Nelson Goh Wei Qiang (A0111014J)
# This script will be executed on the server side to automate the cropping and changing the resolution of videos into
# the respective 360p, 480p, 720p and 1080p resolutions

# Directory on the server where uploaded videos go to
srclocation="/Users/nellystix/Desktop/TESTFOLDER"
# Extensions recognizable by FFMPEG and that can be processed
srcext=".mp4"
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
vidloc=$(find "${srclocation}" -iname "*${srcext}")
# Strip out the leading directory prefixes infront of the filename
vidname_and_ext=$(basename "$vidloc")
# Pure filename without the extension type
vidname=$(basename "$vidname_and_ext" ${srcext})

# Create a folder for all resolutions and cropped parts of the video
mkdir -p -- ${vidname}

# Initalizing the variables to track the (x,y) coordinates of the row and column for the cropped video
x_coord=0
y_coord=0
# 360p video details
# Additional name identifier for the video in 360p format
_360p_ext="_360p"
# 360p cropped video width
_360p_crop_w=120
# 360p cropped video height
_360p_crop_h=120
# Convert the original video to 360p resolution
ffmpeg -i ${vidname_and_ext} -c:v libx264 -b:v 350k -r 24 -s 480x360 -x264opts keyint=48:min-keyint=48:no-scenecut -movflags +faststart -preset slow -profile:v high -c:a libvo_aacenc -b:a 128k -ac 2 ${vidname}${_360p_ext}${finalformat}

# Crop the 360p video into its respective 4:3 parts
# For each column
for i in {1..4}
do
	y_coord=0
	# For each row
	for j in {1..3}
	do
		ffmpeg -i ${vidname}${_360p_ext}${finalformat} -filter:v "crop=${_360p_crop_w}:${_360p_crop_h}:${x_coord}:${y_coord}" ${vidname}${_360p_ext}${r}${j}${c}${i}${finalformat}
		y_coord=$((y_coord + _360p_crop_h))
	done
	x_coord=$((x_coord + _360p_crop_w))
done

# Reinitialize the variables to track the (x,y) coordinates of the row and column for the cropped video
x_coord=0
y_coord=0
# 480p video details
# Additional name identifier for the video in 480p format
_480p_ext="_480p"
# 480p cropped video width
_480p_crop_w=160
# 480p cropped video height
_480p_crop_h=160
# Convert the original video to 480p resolution
ffmpeg -i ${vidname_and_ext} -c:v libx264 -b:v 750k -r 24 -s 640x480 -x264opts keyint=48:min-keyint=48:no-scenecut -movflags +faststart -preset slow -profile:v high -c:a libvo_aacenc -b:a 128k -ac 2 ${vidname}${_480p_ext}${finalformat}

# Crop the 480p video into its respective 4:3 parts
# For each column
for i in {1..4}
do
	y_coord=0
	# For each row
	for j in {1..3}
	do
		ffmpeg -i ${vidname}${_480p_ext}${finalformat} -filter:v "crop=${_480p_crop_w}:${_480p_crop_h}:${x_coord}:${y_coord}" ${vidname}${_480p_ext}${r}${j}${c}${i}${finalformat}
		y_coord=$((y_coord + _480p_crop_h))
	done
	x_coord=$((x_coord + _480p_crop_w))
done

# Reinitialize the variables to track the (x,y) coordinates of the row and column for the cropped video
x_coord=0
y_coord=0
# 720p video details
# Additional name identifier for the video in 720p format
_720p_ext="_720p"
# 720p cropped video width
_720p_crop_w=320
# 720p cropped video height
_720p_crop_h=240
# Convert the original video to 720p resolution
ffmpeg -i ${vidname_and_ext} -c:v libx264 -b:v 2000k -r 24 -s 1280x720 -x264opts keyint=48:min-keyint=48:no-scenecut -movflags +faststart -preset slow -profile:v high -c:a libvo_aacenc -b:a 128k -ac 2 ${vidname}${_720p_ext}${finalformat}

# Crop the 720p video into its respective 4:3 parts
# For each column
for i in {1..4}
do
	y_coord=0
	# For each row
	for j in {1..3}
	do
		ffmpeg -i ${vidname}${_720p_ext}${finalformat} -filter:v "crop=${_720p_crop_w}:${_720p_crop_h}:${x_coord}:${y_coord}" ${vidname}${_720p_ext}${r}${j}${c}${i}${finalformat}
		y_coord=$((y_coord + _720p_crop_h))
	done
	x_coord=$((x_coord + _720p_crop_w))
done

# Reinitialize the variables to track the (x,y) coordinates of the row and column for the cropped video
x_coord=0
y_coord=0
# 1080p video details
# Additional name identifier for the video in 1080p format
_1080p_ext="_1080p"
# 1080p cropped video width
_1080p_crop_w=480
# 1080p cropped video height
_1080p_crop_h=360
# Convert the original video to 1080p resolution
ffmpeg -i ${vidname_and_ext} -c:v libx264 -b:v 5000k -r 24 -s 1920x1080 -x264opts keyint=48:min-keyint=48:no-scenecut -movflags +faststart -preset slow -profile:v high -c:a libvo_aacenc -b:a 128k -ac 2 ${vidname}${_1080p_ext}${finalformat}

# Crop the 1080p video into its respective 4:3 parts
# For each column
for i in {1..4}
do
	y_coord=0
	# For each row
	for j in {1..3}
	do
		ffmpeg -i ${vidname}${_1080p_ext}${finalformat} -filter:v "crop=${_1080p_crop_w}:${_1080p_crop_h}:${x_coord}:${y_coord}" ${vidname}${_1080p_ext}${r}${j}${c}${i}${finalformat}
		y_coord=$((y_coord + _1080p_crop_h))
	done
	x_coord=$((x_coord + _1080p_crop_w))
done

# Create the MPD file for each player (12 in total), comprising of the 360p, 480p, 720p and 1080p versions
# MPD extension type
mpd_ext=".mpd"
# Name identifier for the Media Presentation Description (MPD)
mpd_name="_mpd_"
# For each column
for i in {1..4}
do
	# For each row
	for j in {1..3}
	do
		MP4Box -dash 10000 -profile dashavc264:onDemand -out ${vidname}${mpd_name}${r}${j}${c}${i}${mpd_ext} ${vidname}${_360p_ext}${r}${j}${c}${i}${finalformat}#audio ${vidname}${_360p_ext}${r}${j}${c}${i}${finalformat}#video ${vidname}${_480p_ext}${r}${j}${c}${i}${finalformat}#video ${vidname}${_720p_ext}${r}${j}${c}${i}${finalformat}#video ${vidname}${_1080p_ext}${r}${j}${c}${i}${finalformat}#video
	done
done

# Generate the thumbnail for the video
# Defined thumbnail size
tn_size="640:360"
# Defined thumbnail format
tn_format=".png"
# Generating the actual thumbnail
ffmpeg -i ${vidname_and_ext} -vf  "thumbnail,scale=${tn_size}" -frames:v 1 ${vidname}${tn_format}

# Move all files that have the same video name into the <videoname> folder, EXCEPT the original video
mv *${_360p_ext}* ${vidname}
mv *${_480p_ext}* ${vidname}
mv *${_720p_ext}* ${vidname}
mv *${_1080p_ext}* ${vidname}
# Move the thumbnail of the video into the <videoname> folder
mv ${vidname}${tn_format} ${vidname}

# Delete the original uploaded video
rm ${vidname_and_ext}