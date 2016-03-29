# Pre-existing docker image with ffmpeg preloaded (Centos)
# To build: sudo docker build -t <your-username>/<repository-name> .
# To run: sudo docker run -it -p 1337:1337 --entrypoint='bash' <yout-username>/<repository-name> 
FROM	jrottenberg/ffmpeg

# install utilities
RUN 	yum -y update && yum -y install curl make gcc gcc-c++ git

# install MP4Box (GPAC)
RUN		yum -y install \
			freetype-devel \
			SDL-devel \
			freeglut-devel

RUN 	curl -fsSL https://github.com/gpac/gpac/archive/v0.5.2.tar.gz -o gpac.tar.gz && \
		tar -xzf gpac.tar.gz && cd gpac-0.5.2/ && \
			./configure --static-mp4box --use-zlib=no && \
		make -j4 && make install && \	
		ln -s /usr/local/bin/MP4Box /usr/bin/MP4Box && \
		cd .. && rm -rf gpac && rm gpac.tar.gz && rm -rf gpac-0.5.2

# install nodejs (version 0.11.0)
RUN 	curl -sL https://rpm.nodesource.com/setup | bash - && \
		yum -y install nodejs && npm install -g npm@2.8.3

# install sailsjs
RUN		npm --quiet -g install sails@0.11.0

# install prerequisites
RUN		npm install --quiet -g install grunt-cli bower

# Set /zoomable as pwd and copy all files to this container's directory
WORKDIR	/zoomable
ADD		.	/zoomable				

# install npm packages
RUN		npm install && \
	 	bower install --quiet --allow-root --config.interactive=false

# cleanup
RUN 	npm cache clean