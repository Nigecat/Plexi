
module.exports = {
    args: ["<min>", "<max>"],
    perms: [],
    description: "Get a random number between <min> and <max> (inclusive)",
    call: function (message, args) {
        let min = Math.ceil(args[0]);
        let max = Math.floor(args[1]);
        message.channel.send(Math.floor(Math.random() * (max - min + 1)) + min);
    }
}