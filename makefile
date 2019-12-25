
install:
	cp $(shell pwd)/ffmpeg/ffmpeg.exe $(shell pwd)/Plexi/ffmpeg.exe
	echo '{ "PREFIX": "$$", "TOKEN": "NjIxMTc5Mjg5NDkxOTk2Njgz.XXhmFw.IgagFyMii9zzY8gRAZBTPHxTkDU" }' >> Plexi/config.json
	mkdir Plexi/modules
	cd Plexi/modules && npm install discordjs/discord.js opusscript ytdl-core ffmpeg
