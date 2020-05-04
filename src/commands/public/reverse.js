
module.exports = {
    args: "[text]",
    perms: [],
    description: "Reverse the specified text",
    call: function(message, args) {
        args = args.join(" ");
        message.channel.send(`\`${args}\`   reversed is   \`${args.split("").reverse().join("")}\``);
    }
}