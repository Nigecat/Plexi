# Plexi
![build](https://github.com/Nigecat/Plexi/workflows/build/badge.svg)
![lint](https://github.com/Nigecat/Plexi/workflows/lint/badge.svg)
![docs](https://github.com/Nigecat/Plexi/workflows/docs/badge.svg)

A general purpose discord bot


## Setup
The bot pulls it's tokens from environment variables.  
So, first make a file called `.env` in the root directory of the files (same directory as the package.json file).  
This file should contain two tokens, the [bot token](https://discord.com/developers/applications) (TOKEN) and a [youtube data api v3 token](https://console.developers.google.com/apis/credentials) (YOUTUBE_API_TOKEN)

The finished file should look sometehing like the following:
```
TOKEN=xxxxxxx
YOUTUBE_API_TOKEN=xxxxx
```
