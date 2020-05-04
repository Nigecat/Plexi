
module.exports = {
    args: "",
    description: "This function has been moved to {prefix}top instead of {prefix}catrd top, run help top for more info",
    call: function(message) {
        message.channel.send("This function has been moved to `top` instead of `catrd top`, run `help top` for more info");
    }
}