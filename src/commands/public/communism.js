
const communism = {
    "my": "our",
    "i": "we",
    "me": "we",
    "your": "our",
    "you": "we",
    "any reason": "for the great communist nation"
}

module.exports = {
    args: "[text]",
    perms: [],
    description: "Make text communist",
    call: function(message, args) {
        for (let i = 0; i < args.length; i++) {
            for (const key in communism) {
                if (args[i] == key) {
                    args[i] = communism[key];
                }
            }
        }
        message.channel.send("☭ " + args.join(" ") + " ☭");
    }
}
