const rf = require('random-facts');

module.exports = {
    args: [],
    perms: [],
    description: "Get a random fact",
    call: function(message) {
        message.channel.send(rf.randomFact())
    }
}