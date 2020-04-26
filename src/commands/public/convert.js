const convert = require("convert-units");

module.exports = {
    args: ["<value>", "<from-unit>", "<to-unit>"],
    perms: [],
    description: "Convert a value from one unit to another (e.g convert 4 lb kg)",
    call: function (message, args) {
        try {
            let result = convert(args[0]).from(args[1]).to(args[2]);
            message.channel.send(`**Converting:** ${args[0]} ${args[1]} to ${args[2]}\n**Result:** ${result}${args[2]}`);
        } catch (err) {
            message.channel.send(`**Unrecognized unit conversion:** ${args[1]}/${args[2]}`)
        }
    }
}