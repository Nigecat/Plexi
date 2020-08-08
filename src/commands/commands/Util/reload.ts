import { resolve } from "path";
import loadCommands from "../../";
import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

/* WORK IN PROGRESS */
export default class Reload extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "reload",
            description: "Reload ALL commands",
            group: "Util",
            ownerOwnly: true,
            hidden: true,
        });
    }

    async run(message: Message): Promise<void> {
        try {
            // Loop through each command and remove it from the module cache
            this.client.commands.forEach(
                (command) =>
                    delete require.cache[
                        require.resolve(resolve(__dirname, "..", command.options.group, `${command.name}.js`))
                    ],
            );

            // Now that they are all unloaded we can load them again normally
            this.client.emit("debug", this.client.commands.get("invite").options.description);
            this.client.commands.clear();
            this.client.commands = await loadCommands(this.client);
            this.client.emit("debug", this.client.commands.get("invite").options.description);

            message.channel.send(`Successfully reloaded ${this.client.commands.size} commands!`);
            this.client.emit("debug", `Reloaded ${this.client.commands.size} commands`);
        } catch (err) {
            this.client.emit("error", err);
            message.channel.send(`Unable to reload commands: \`${err}\``);
        }
    }
}
