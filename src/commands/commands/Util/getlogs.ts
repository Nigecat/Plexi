import ms from "ms";
import { promises as fs } from "fs";
import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class GetLogs extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "getlogs",
            group: "Util",
            description: "Retrieve the bot logs",
            ownerOwnly: true,
            hidden: true,
            args: [
                {
                    name: "timeframe",
                    type: "string",
                    validate: (timeframe: string) => ms(timeframe) !== undefined,
                },
                {
                    name: "level",
                    type: "string",
                    default: "all",
                },
            ],
        });
    }

    async run(message: Message, [timeframe, level]: [string, string]): Promise<void> {
        const data = (await fs.readFile("logs/combined.log", "utf-8"))
            .split(/\r?\n/)
            .filter((line) => line)
            .map((line) => JSON.parse(line));

        const expected = new Date(Date.now() - ms(timeframe));

        const output = data
            .filter(
                (line) =>
                    new Date(line.timestamp) >= expected &&
                    (level === "all" || line.level === level) &&
                    !line.message.includes("token"),
            )
            .map((line) => `${line.level}: ${line.message} (${line.timestamp})`);

        if (output.length > 0) {
            message.channel.send(output, { split: true });
        } else {
            message.channel.send("No logs were found for that timeframe (or level)");
        }
    }
}
