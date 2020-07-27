import Server from "../../models/server.js";
import { Command, CommandData, InvalidArgument } from "../../types.js";

export default {
    description: "Set an autorole for this server, this role will be automatically applied to new members",
    args: ["<set | clear> <@role>"],
    perms: ["ADMINISTRATOR"],
    async call({ message, args, database }: CommandData) {
        if (args.length === 0 || args.length > 2) throw new InvalidArgument();
        if (args[0] !== "set" && args[0] !== "clear") throw new InvalidArgument();
        if (args[0] === "set" && message.mentions.roles.size !== 1) throw new InvalidArgument();
        if (args[0] === "clear" && args.length !== 1) throw new InvalidArgument();

        const server = await Server(database, message.guild.id);
        if (args[0] === "set") {
            server.autorole = message.mentions.roles.first().id;
            message.channel.send(`Set autorole to: ${message.mentions.roles.first()}`, { allowedMentions: { roles: [] } });
        }
        else {
            server.autorole = null;
            message.channel.send("Autorole cleared!");
        }
    }
} as Command
