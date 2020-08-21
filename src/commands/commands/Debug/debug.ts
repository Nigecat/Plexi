import { Plexi } from "../../../Plexi";
import { getHeapStatistics } from "v8";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";
import { version } from "../../../../package.json";
import { cpus, arch, totalmem, freemem } from "os";
import { Message, MessageEmbed } from "discord.js";

/* eslint-disable prettier/prettier */

export default class Debug extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "debug",
            group: "Debug",
            ownerOwnly: true,
            hidden: true,
            description: "Get debug info",
        });
    }

    run(message: Message): void {
        const heap = getHeapStatistics();
        const embed = new MessageEmbed({
            color: "RANDOM",
            footer: { text: `Using v${version}` },
            timestamp: new Date(),
            fields: [
                {
                    name: "Master Process Information",
                    value: stripIndents`
                        Process is running **${process.release.name} ${process.version}** (located at **${process.execPath}**) with Process ID **${process.pid}**, node is running from **${process.cwd()}**.
                        Process has been running for **${process.uptime() / 3600} hours**.
                    `,
                },
                {
                    name: "Operating System Information",
                    value: stripIndents`
                        Hosted on **${process.platform}**, using a ${cpus().length}-core processor with ${arch()} architecture.
                        System has a total of **${Math.ceil(totalmem() / 1000000)}MB** RAM, of which **${Math.ceil((totalmem() - freemem()) / 1000000)}MB** is in use.
                    `,
                },
                {
                    name: "Memory Information",
                    value: stripIndents`
                        Detected **${formatSize(heap.malloced_memory)}** allocated memory with a heap size limit of **${formatSize(heap.heap_size_limit)}**.
                        Current used heap size is **${formatSize(heap.used_heap_size)}/${formatSize(heap.total_heap_size)}**, physical size is **${formatSize(heap.total_physical_size)}**.
                    `,
                }
            ],
        });

        message.channel.send({ embed });
    }
}

function formatSize(size: number): string {
    const kb = size / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;

    if (kb < 1024) {
        return `${kb.toFixed(0)}KB`;
    } else if (kb > 1024 && mb < 1024) {
        return `${mb.toFixed(0)}MB`;
    }

    return `${gb.toFixed(0)}GB`;
};
