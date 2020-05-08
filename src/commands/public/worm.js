
module.exports = {
    args: ["<length>"],
    perms: [],
    description: "Create a worm of the specified length",
    call: function(message, args) {
        if (!isNaN(args[0])) {
            let length = parseFloat(args[0]);
            if (length < 0) {
                message.channel.send("Length must be a positive number!");
            } else {
                message.channel.send(`<:worm_head:708133267366477944>${"<:worm_body:708133266644926505>".repeat(length)}<:worm_tail:708133266657640578>`).catch(() => {
                    message.channel.send("That worm would be too long to post!");
                });
            }
        } else {
            message.channel.send("Length must be a number!");
        }
    }
}