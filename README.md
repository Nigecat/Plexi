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

Development dependencies can be installed by running `npm ci --no-optional`.
For a production environment it is recommended to install all dependencies, this can be done with `npm ci`.

The bot pulls it's tokens from environment variables. There are five fields it checks for:

- `DISCORD_TOKEN` - the [bot token](https://discord.com/developers/applications).
- `YOUTUBE_TOKEN` - a [youtube data api v3 token](https://console.developers.google.com/apis/credentials).
- `TOPGG_TOKEN` - the [top.gg token](https://top.gg/api/docs#mybots).
- `DATABASE_URI` - a uri to a [mongodb](https://www.mongodb.com/) database to store persistent data in, must begin with `mongodb://` (this is highly recommended even for development).
- And finally if `NODE_ENV` is set to `production` the console.logs will be disabled and written to the logs/ directory.

The only required token is the discord token. Everything else is technically optional (though, if a command is run that requires one a token that was not specified it will cause an error).
The top.gg token will only be used if we are in production mode.

The environment variables can also be automatically loaded from a `.env` file placed in the root directory of this project.
A minimal setup would look like:

```markdown
DISCORD_TOKEN=xxxxxxxxxxx
```

The bot can then be started with `npm start`.

### Docker

The docker image can be built directly from the git repo with `docker build https://github.com/Nigecat/Plexi.git -t plexi`  
The environment variables must be passed through the build command. These are named the same as above, e.g `docker build --build-arg DISCORD_TOKEN=xxxxxx -t plexi https://github.com/Nigecat/Plexi.git`  
On linux, an extra flag is required to allow the mongodb database to connect to localhost: `--add-host=host.docker.internal:host-gateway`
