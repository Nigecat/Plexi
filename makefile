
install:
	cp $(shell pwd)/ffmpeg/ffmpeg.exe $(shell pwd)/plexi/ffmpeg.exe
	mkdir plexi/modules
	cd plexi/modules && npm install discordjs/discord.js opusscript ytdl-core ffmpeg
