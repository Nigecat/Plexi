
module.exports = {
    args: [],
    perms: [],
    description: "shrimp",
    call: function(message) {
        message.channel.send({ files: [ "./commands/resources/shrimp.png" ] });
    }
}