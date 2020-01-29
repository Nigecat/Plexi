
install:
	cd src/ && npm install discordjs/discord.js opusscript discordjs/opus ytdl-core
	rm -f src/package-lock.json

start:
	@cd src/ && node main.js