
module.exports = {
    args: [],
    perms: [],
    description: "Slam someone against a table",
    call: function(message) {
        message.channel.send({files: ["./commands/resources/tableslam.png"]})
    }
}