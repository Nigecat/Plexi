# Plexi
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=Nigecat/Plexi&identifier=207711753)](https://dependabot.com) 
[![CircleCI](https://circleci.com/gh/Nigecat/Plexi.svg?style=svg&circle-token=5401c770dc2a6dad53621bbe9a9371bf47835a26)](<LINK>)

A general purpose discord bot


## Setup
Dependencies can be installed by running `npm ci --no-optional`.

The bot pulls it's tokens from environment variables. There are four fields it checks for:
 - `DISCORD_TOKEN` - the [bot token](https://discord.com/developers/applications).
 - `YOUTUBE_TOKEN` - a [youtube data api v3 token](https://console.developers.google.com/apis/credentials).
 - `TOPGG_TOKEN` - the [top.gg token](https://top.gg/api/docs#mybots).
 - And finally if `NODE_ENV` is set to `production` the console.logs will be disabled and written to the logs/ directory.

The only required token is the discord token. Everything else is technically optional (if music commands are run without a youtube token it will cause an error). 
The top.gg token will only be used if it is specified and we are in production mode.

The environment variables can also be automatically loaded from a `.env` file. A minimal setup would look like:
```
DISCORD_TOKEN=xxxxxxxxxxx
```
