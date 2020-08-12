# Plexi

[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=Nigecat/Plexi&identifier=207711753)](https://dependabot.com) [![CircleCI](https://circleci.com/gh/Nigecat/Plexi.svg?style=svg&circle-token=5401c770dc2a6dad53621bbe9a9371bf47835a26)](<LINK>)

A general purpose discord bot

## Setup

Development dependencies can be installed by running `npm ci --no-optional`.
For a production environment it is recommended to install all dependencies, this can be done with `npm ci`.

The bot pulls it's tokens from environment variables. There are five fields it checks for:

- `DISCORD_TOKEN` - the [bot token](https://discord.com/developers/applications).
- `YOUTUBE_TOKEN` - a [youtube data api v3 token](https://console.developers.google.com/apis/credentials).
- `TOPGG_TOKEN` - the [top.gg token](https://top.gg/api/docs#mybots).
- `DATABASE_URI` - a uri to a [mongodb](https://www.mongodb.com/) database to store persistent data in (this is highly recommended).
- And finally if `NODE_ENV` is set to `production` the console.logs will be disabled and written to the logs/ directory.

The only required token is the discord token. Everything else is technically optional (though, if a command is run that requires one a token that was not specified it will cause an error).
The top.gg token will only be used if we are in production mode.

The environment variables can also be automatically loaded from a `.env` file placed in the root directory of this project.
A minimal setup would look like:

```markdown
DISCORD_TOKEN=xxxxxxxxxxx
```

The bot can then be started with `npm start`.
