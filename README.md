# Plexi
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=Nigecat/Plexi&identifier=207711753)](https://dependabot.com) 
[![CircleCI](https://circleci.com/gh/Nigecat/Plexi.svg?style=svg&circle-token=5401c770dc2a6dad53621bbe9a9371bf47835a26)](<LINK>)

A general purpose discord bot


## Setup
The bot pulls it's tokens from environment variables.  
So, first make a file called `.env` in the root directory (they can also be loaded from the device environment variables, this is preferred in a production environment).  
This file should contain two tokens, the [bot token](https://discord.com/developers/applications) (DISCORD_TOKEN) and a [youtube data api v3 token](https://console.developers.google.com/apis/credentials) (YOUTUBE_TOKEN).
If the NODE_ENV flag is set to 'production' (`NODE_ENV=production`) a third flag is also required, this should be a [top.gg api token](https://top.gg/api/docs#mybots) (TOPGG_TOKEN)

The finished file should look something like the following (when not in a production environment):
```
DISCORD_TOKEN=xxxxxxx
YOUTUBE_TOKEN=xxxxxxx
```

For a production environment (and not using the environment variables), the file should look like this:
```
DISCORD_TOKEN=xxxxxxx
YOUTUBE_TOKEN=xxxxxxx
TOPGG_TOKEN=xxxxxxx
NODE_ENV=production
```
