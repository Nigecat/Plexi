
install:
	cd src/ && npm install discordjs/discord.js discordjs/opus
	rm -f src/package-lock.json

start:
	@cd src/ && node main.js