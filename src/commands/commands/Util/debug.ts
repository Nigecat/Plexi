import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { version } from "../../../../package.json";
import { cpus, arch, totalmem, freemem } from "os";
import { Message, MessageEmbed } from "discord.js";
import { stripIndents, oneLine } from "common-tags";

export default class Debug extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "debug",
            group: "Util",
            ownerOwnly: true,
            description: "Get debug info",
        });
    }

    run(message: Message): void {
        const embed = new MessageEmbed({
            color: "RANDOM",
            footer: { text: `Using v${version}` },
            fields: [
                {
                    name: "Master Process Information",
                    value: stripIndents`
                        ${oneLine`
                            Process is running **${process.release.name} ${process.version}** 
                            (located at **${process.execPath}**) 
                            with Process ID **${process.pid}**, 
                            node is running from **${process.cwd()}**`}
                        Process has been running for **${process.uptime() / 3600} hours**
                    `,
                },
                {
                    name: "Operating System Information",
                    value: stripIndents`
                        ${oneLine`
                            Hosted on **${process.platform}**, 
                            using a ${cpus().length}-core processor 
                            with ${arch()} architecture`}
                        ${oneLine`
                            System has a total of **${Math.ceil(totalmem() / 1000000)}MB** RAM, 
                            of which **${Math.ceil((totalmem() - freemem()) / 1000000)}MB** is in use`}
                    `,
                },
            ],
        });

        message.channel.send({ embed });
    }
}
