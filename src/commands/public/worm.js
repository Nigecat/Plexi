
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
                message.channel.send(`<:h_:708133267366477944>${"<:b_:708133266644926505>".repeat(length)}<:t_:708133266657640578>`).catch(() => {
                    message.channel.send("That worm would be too long to post!");
                });
            }
        } else {
            message.channel.send("Length must be a number!");
        }
    }
}