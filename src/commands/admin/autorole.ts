import { Role } from "discord.js";
import { isHigherRole } from "../../util.js";
import { PlexiClient } from "../../client.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class AutoRole extends Command {
    constructor(client: Client) {
        super(client, {
            name: "autorole",
            memberName: "autorole",
            group: "admin",
            guildOnly: true,
            userPermissions: ["ADMINISTRATOR"],
            clientPermissions: ["MANAGE_ROLES"],
            description: "Set or remove the autorole for this server, this role will be automatically added to any new members (there are two available actions, [set/clear])\nNOTE: Ensure that the role you set is below the highest role I have so I can actually apply it.",
            args: [
                {
                    key: "action",
                    prompt: "What do you want to do [set/clear/view]?",
                    type: "string",
                    oneOf: ["set", "clear", "view"],
                    error: "Run help autorole for more information on how to use this command! What do you want to do [set/clear/view]?"
                },
                {
                    key: "role",
                    prompt: "What role do you want to set as the autorole",
                    type: "role",
                    default: ""
                }
            ]
        });
    } 

    async run(message: CommandoMessage, { action, role }: { action: string, role: Role }) {
        if (action === "set") {
            if (role) {
                // Check if we have a higher role than the target
                if (isHigherRole(message.guild.me.roles.highest, role)) {
                    await (this.client as PlexiClient).data.autoroles.set(message.guild.id, role.id);
                    return message.say("Autorole set!");
                } else {
                    return message.say("I must have a higher role than the autorole you are setting!");
                }
            } else {
                return message.say("You must also specify the role to set!");
            }
        } else if (action === "clear") {
            await (this.client as PlexiClient).data.autoroles.delete(message.guild.id);
            return message.say("Autorole cleared!");
        } else if (action === "view") {
            return message.say(`This server's autorole is currently: ${message.guild.roles.cache.get(await (this.client as PlexiClient).data.autoroles.get(message.guild.id))}`, { allowedMentions: { roles: [], users: [] } })
        }
    }
}