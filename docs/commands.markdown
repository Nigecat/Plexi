---
layout: page
title: Commands
permalink: /commands
---

## Notes for reading:
- [user] - A discord user, this can be either a mention or the id of a user.
- [member] - A discord member, this can be either a mention or the id of a user **in the same server as where you are running this command**
- [arg...] - The argument can have an infinite length. Any other arguments are restricted to a single word.
- [arg1 \| arg2] - The supplied argument must be one of these.

### Economy

| Command | Description | Usage |
| ------- | :---------: | ----- |
| checkbal | Check another user's coin balance | $checkbal [user] |
| give | Give a user some of your coins | $give [user] [coins] |


### Fun

| Command | Description | Usage |
| ------- | :---------: | ----- |
| clap | Put the 👏 emoji in the spaces of the specified text,  if no text is supplied it will use the previous message | $clap [text] |
| communism | Make some text communist, if no text is supplied it will use the previous message | $communism [text] |
| cow | Force a cow to say the specified text | $cow [text...] |
| crab | Put the 🦀 emoji around the specified text,  if no text is supplied it will use the previous message | $crab [text] |
| defineud | Get the urban dictionary definition of a word | $defineud [word] |
| kaomoji | Display a random kaomoji! (´・ω・｀) 3000 will definitely be enough to keep you busy! (ｖ｀▽´)ｖ | $kaomoji  |
| mock | Mock the previous message | $mock  |
| ship | Ship two users (merge their usernames) | $ship [user1] [user2] |
| shipn | Ship two users (merge their nicknames) | $shipn [user1] [user2] |
| shout | 🇸 🇭 🇴 🇺 🇹    🇹 🇭 🇪    🇸 🇺 🇵 🇵 🇱 🇮 🇪 🇩    🇹 🇪 🇽 🇹 ❗ | $shout [text...] |
| shrimp | Shrimp | $shrimp  |
| tableslam | Slam someone against a table | $tableslam  |
| worm | Make a worm of the specified length | $worm [length] |


### General

| Command | Description | Usage |
| ------- | :---------: | ----- |
| anime | Searches for an anime on Kitsu.io | $anime [anime...] |
| animepic | Get a random anime pic | $animepic  |
| avatar | Get a user's avatar | $avatar [user] |
| catfact | Get a random cat fact | $catfact  |
| clearserverdata | Clear ALL data stored relating to this server | $clearserverdata  |
| clearuserdata | Clear ALL data stored relating to you | $clearuserdata  |
| coinflip | Flip a coin | $coinflip  |
| define | Get the dictionary definition of a word | $define [word] |
| displayhex | Display the colour of a hex code, must be a valid 6 digit hex code | $displayhex [hex] |
| dogfact | Get a random dog fact | $dogfact  |
| feedback | Want to give feedback? Encountered any bugs? Have a suggestion? | $feedback [text...] |
| help | Displays a list of available commands, or detailed information for a specified command | $help [command] |
| invite | Generate an invite link for adding me to a server | $invite  |
| isprime | Check if a number is a prime (NOTE: Will prevent the command from running at ~300 digits) | $isprime [number] |
| lmgtfy | LMGTFY a search query, if no text is supplied it will use the previous message | $lmgtfy [text...] |
| ping | Check the bot's ping to the Discord server | $ping  |
| reverse | Reverse the supplied text | $reverse [text...] |
| roll | Get a random number (inclusive) between the two specified numbers | $roll [min] [max] |
| servericon | Get the icon of this server | $servericon  |
| serverinfo | Get info on this server | $serverinfo  |
| stats | Get general stats about the bot | $stats  |
| weather | Get the weather for the specified city (add c/f to the end to specify the degree type) | $weather [city] <c/f> |
| whatanime | Attempt to figure out what anime an image comes from, if no url is supplied it will act on the image from the previous message | $whatanime [url...] |


### Image

| Command | Description | Usage |
| ------- | :---------: | ----- |
| burn | Burn an image | $burn [url] |
| cat | Get a random cat image | $cat  |
| char | Char an image | $char [url] |
| deepfry | Deepfry an image | $deepfry [url] |
| dog | Get a random dog image | $dog  |
| panfry | Panfry an image | $panfry [url] |


### Moderation

| Command | Description | Usage |
| ------- | :---------: | ----- |
| ban | Ban a user | $ban [user] [reason...] |
| create-emoji | Create a new emoji in this server | $create-emoji [emojiName] [imageURL] |
| create-role-preset | Create a role preset | $create-role-preset [muted] |
| forceban | Ban a user by their id, this does not require the user to be in this server. | $forceban [user] [reason...] |
| kick | Kick a user | $kick [user] [reason...] |
| prefix | Set the prefix for this server,  if no prefix is specified this will return the current prefix for this server | $prefix [prefix] |
| purge | Delete the most recent <limit> messages in this channel. Max 50 messages at a time. | $purge [limit] |
| slowmode | Sets the slowmode of a channel, can be set to any number (in seconds) - unlike the channel settings! | $slowmode [seconds] |


### Music

| Command | Description | Usage |
| ------- | :---------: | ----- |
| listen.moe | Stream music from `https://listen.moe` into your current voice channel | $listen.moe  |
| loop | Loop music into your voice channel (takes either a search query or a youtube url) | $loop [search...] |
| pause | Pause the currently playing song | $pause  |
| play | Play music into your voice channel (takes either a search query or a youtube url) | $play [search...] |
| resume | Resume (unpause) the currently playing song | $resume  |
| summon | Summon the bot into your voice channel | $summon  |