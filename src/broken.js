// stuff that is broken

// audio commands
case "play": {
    this.player = new utils.audioPlayer(message, args[0], "online", 1, false);
    this.player.play();
    break;
}

case "pause": {
    message.delete();
    this.player.pause();
    break;
}

case "resume":
case "unpause": {
    message.delete();
    this.player.resume();
    break;
}

case "disconnect": {
    message.delete();
    this.player.leave();
    break;
}

case "local": {
    this.player = new utils.audioPlayer(message, `sound/${args[0]}.mp3`, "local", 2, true);
    this.player.play();
    break;
}



// probably work but cant be bothered to fix yet
case "lock": {
    if (message.member.hasPermission("ADMINISTRATOR")) {      // admin only since this is potentially server-breaking
        message.delete();
        var user = message.mentions.members.first();
        var lockChannel = user.voice.channel;
        this.lock = setInterval(() => { user.voice.setChannel(lockChannel)}, 1000);
    } else {
        missingPerm(message, "ADMINISTRATOR");
    }
    break;
}

/**
 * Remove all active locks
 */
case "unlock": {
    if (message.member.hasPermission("ADMINISTRATOR")) {   
        message.delete();
        clearInterval(this.lock);
    } else {
        missingPerm(message, "ADMINISTRATOR");
    }
    break;
}

/**
 * Make a user follow another user    *only one active per server
 * @parem <@user> leader
 * @parem <@user> follower
 */
case "follow": {
    if (message.member.hasPermission("ADMINISTRATOR")) {      // admin only since this is potentially server-breaking
        message.delete();
        var leader = message.mentions.members.last();
        var follower = message.mentions.members.first();
        this.follow = setInterval(() => { follower.voice.setChannel(leader.voice.channel) }, 1000);
    } else {
        missingPerm(message, "ADMINISTRATOR");
    }
    break;
}

/**
 * Removed all active followings
 */
case "unfollow": {
    if (message.member.hasPermission("ADMINISTRATOR")) {   
        message.delete()
        clearInterval(this.follow);
    } else {
        missingPerm(message, "ADMINISTRATOR");
    }
    break;
}