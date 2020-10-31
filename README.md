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

## Requirements
> Note: All options other than node.js and the discord bot token are \*technically\* optional but if a user tries to run anything that uses them the bot will error. They should all be included in a production environment.
 - [Node.js](https://nodejs.org/en/) v12 or newer
 - Discord Bot Token - [Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
 - YouTube Data API v3 Token - [Guide](https://developers.google.com/youtube/v3/getting-started)
 - Emilia API Token - [Link](https://emilia-api.xyz/)
 - [**Optional**] A [top.gg](https://top.gg/) Token - [Link](https://discordbots.org/api/docs#mybots)

## Getting Started
Clone the repository and install dependencies.  
`git clone https://github.com/Nigecat/Plexi.git`  
`cd Plexi`  
`npm ci`

## Configuration
Create a file `.env` and place it in the root of the project, the tokens mentions in the requirements section should go here. The following is a sample of this file with the different keys.
```
DISCORD_TOKEN=xxxxxxxx
YOUTUBE_TOKEN=xxxxxxxx
TOPGG_TOKEN=xxxxxxxx
EMILIA_TOKEN=xxxxxxxx
```
If running in a production environment, an additional key called `NODE_ENV` should be set to `production`. For development this should be set to `development`  
If you wish for the bot to update it's status on top.gg, set the `TOPGG_TOKEN` key to your token. This key can be safely omitted if you do not want this.

## Data Storage
The bot uses [mongodb](https://www.mongodb.com/) to store persistent user data between sessions. However, since this can be difficult to setup in development environments, the bot can also function through docker. If using an external mongodb setup, set the `DATABASE_URI` key to the uri to the database in the `.env` file. This is a must have for a production environment.

## Starting the Bot
If you are using an external mongodb environment you can simple run `npm start` to start the bot.  
If you are relying on docker to handle it, ensure the docker daemon is running and run `npm run start:dev`. This should only be used in a development environment.

## Commands
See https://nigecat.github.io/Plexi/commands for a list of commands.

## Contributing
1. [Fork the repository](https://github.com/Nigecat/Plexi/fork)
2. Clone your fork: `git clone https://github.com/your-username/Plexi.git`
3. Create your feature branch: `git checkout -b my-feature`
4. Commit your changes: `git commit -m "Add my feature"`
5. Push the branch: `git push origin -u my-feature`
6. Submit a [pull request](https://github.com/Nigecat/Plexi/pulls)