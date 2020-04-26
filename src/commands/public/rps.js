
function compare(map, choice1, choice2) {
    return (map[choice1] || {})[choice2] || "Invalid action";
}

module.exports = {
    args: ["<rock|paper|scissors>"],
    perms: [],
    description: "Play rock paper scissors against the bot",
    call: function (message, args) {
        const choices = ["rock", "paper", "scissors"];

        if (choices.includes(args[0])) {
            let choice1 = args[0];
            let choice2 = choices[Math.floor(Math.random() * choices.length)];
            let map = {};

            choices.forEach(function(choice, i) {
                map[choice] = {};
                map[choice][choice] = "it is a tie"
                map[choice][choices[(i+1)%3]] = choices[(i+1)%3] + " wins"
                map[choice][choices[(i+2)%3]] = choice + " wins"
            })

            message.channel.send(`You play ${choice1}, I play ${choice2}, ${compare(map, choice1, choice2)}!`);

        } else {
            message.channel.send("Invalid action");
        }
    }
}