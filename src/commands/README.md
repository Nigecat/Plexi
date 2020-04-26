## How to add a new command
Put any resources for the commands in `/commands/resources` (such as images)  
If you have functions that run accross multiple commands, add them to `/commands/util.js`
### /commands/private - Commands restricted to bot owner only  
```javascript
/commands/private/commandName.js

module.exports = function(message, args) { }
```
### /commands/public - Commands that can be run by anyone  
```javascript
/commands/public/commandName.js

module.exports = {
	args: [],	// the required arguments (this is for the help menu, please wrap each on in <>, set this to a string if the amount of arguments isn't static, if it's a string wrap it in [])
	perms: [],	// the perms required to run this command (leave blank for anyone to be able to run it)
    description: "",		// description for command (this is for help menu, try to keep it short)
    call: function (message, args) { }
}
```
View the list of perms on the [discord.js docs](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS)
