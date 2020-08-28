<div align="center">
  <br />
  <p>
    <a href="https://nigecat.github.io/Plexi/"><img src="banner.png" width="546" alt="Plexi" /></a>
  </p>
  <br />
  <p>
    <a href="https://nigecat.github.io/Plexi/"><img src="https://circleci.com/gh/Nigecat/Plexi.svg?style=svg&circle-token=5401c770dc2a6dad53621bbe9a9371bf47835a26" alt="Build status" /></a>
    <a href="https://david-dm.org/Nigecat/Plexi"><img src="https://img.shields.io/david/Nigecat/Plexi.svg?maxAge=3600" alt="Dependencies" /></a>
    <a href="https://nigecat.github.io/Plexi/support"><img src="https://img.shields.io/discord/621181741972979722.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2" alt="Discord" /></a>
  </p>
</div>

## Setup
All of the tokens are loaded from environment variables.  
These can either be configured on the device or placed in an `.env` file in the root of this project, this file will be automatically loaded when the application starts.  
The tokens that are checked for are: 
|   Name         |  Description  |
|----------------|---------------|
| DISCORD_TOKEN  | A [discord bot token](https://discord.com/developers/applications). |
| YOUTUBE_TOKEN  | A [youtube data api v3 token](https://console.developers.google.com/apis/credentials). |
| TOPGG_TOKEN    | A [top.gg](https://top.gg/api/docs#mybots) token. |
| DATABASE_URI   | A uri to a [mongodb](https://www.mongodb.com/) database to store persistent data in, must begin with `mongodb://`. |
| EMILIA_TOKEN   | An [Emilia-API](https://emilia-api.xyz/) token. |
| NODE_ENV       | If this is set to 'production' all console logs will be disabled. |

The only required token is the `DISCORD_TOKEN`. However, errors will occur if the program attempts to access any of the other keys.

The bot can be started with `npm start`, but for development it is recommended to use docker. `docker-compose up --build` can be used to start the bot and a mongodb instance for testing (or `npm run start:dev` as a shortcut). The files are automatically rebuilt if they are changed.
The container will have to be manually restarted if a file that is not a command is updated. Commands can be reloaded by running `$reload` through discord.
