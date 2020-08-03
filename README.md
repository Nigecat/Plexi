# Plexi
![build](https://github.com/Nigecat/Plexi/workflows/build/badge.svg)
![lint](https://github.com/Nigecat/Plexi/workflows/lint/badge.svg)
![docs](https://github.com/Nigecat/Plexi/workflows/docs/badge.svg)

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
