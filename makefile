
install:
	cp $(shell pwd)/ffmpeg/ffmpeg.exe $(shell pwd)/plexi/ffmpeg.exe
	mkdir -p plexi/data
	mkdir -p plexi/data/user
	mkdir -p plexi/data/server
	mkdir -p plexi/modules
	cd plexi/modules && npm install discordjs/discord.js opusscript ytdl-core ffmpeg
