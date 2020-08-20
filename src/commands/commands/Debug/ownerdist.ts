import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";

export default class OwnerDist extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "ownerdist",
            group: "Debug",
            hidden: true,
            ownerOwnly: true,
            description: "Get the bot guild owner distribution",
        });
    }

    async run(message: Message): Promise<void> {
        const uniqueOwners = [...new Set(this.client.guilds.cache.map(({ owner }) => (owner ? owner.id : null)))];
        message.channel.send(stripIndents`
            \`\`\`
            Total Guilds: ${this.client.guilds.cache.size}
            Total Unique Guild Owners: ${uniqueOwners.length}
            Owner distribution: ${(uniqueOwners.length / this.client.guilds.cache.size) * 100}%
            \`\`\`
        `);
    }
}
