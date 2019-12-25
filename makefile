
install:
	cp $(shell pwd)/ffmpeg/ffmpeg.exe $(shell pwd)/Plexi/ffmpeg.exe
	mkdir Plexi/modules
	cd Plexi/modules && npm install discordjs/discord.js opusscript ytdl-core ffmpeg
