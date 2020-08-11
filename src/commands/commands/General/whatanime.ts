import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { lastMessage, fetch } from "../../../utils/misc";

export default class WhatAnime extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "whatanime",
            group: "General",
            description:
                "Attempt to figure out what anime an image comes from, if no url is supplied it will act on the image from the previous message",
            args: [
                {
                    name: "url",
                    type: "string",
                    default: "USE_PREVIOUS",
                    infinite: true,
                },
            ],
        });
    }

    async run(message: Message, [url]: [string]): Promise<void> {
        // Get the previous message, this is the message that we are mocking
        if (url === "USE_PREVIOUS") {
            const msg = await lastMessage(message.channel);
            if (isUrl(msg.content)) url = msg.content;
            else if (msg.attachments.size > 0) url = msg.attachments.first().url;
        }

        if (url && url !== "USE_PREVIOUS") {
            const result = await message.channel.send("Searching...");

            const res = await fetch(`https://trace.moe/api/search?url=${encodeURI(url)}`);
            if (typeof res !== "string") {
                if (res.docs[0].title_english) {
                    this.client.commands.get("anime").run(message, [res.docs[0].title_english]);
                    result.delete();
                } else if (res.docs[0].title_romaji) {
                    this.client.commands.get("anime").run(message, [res.docs[0].title_romaji]);
                    result.delete();
                } else {
                    result.edit("I could not find anything close to that...");
                }
            } else {
                result.edit("I could not find anything close to that...");
            }
        } else {
            // TODO: Re-enable
            // const prefix = await this.client.prefixes.get(message.guild ? message.guild.id : "", true);
            // message.channel.send(generateHelp(this, prefix));
        }
    }
}

function isUrl(str: string): boolean {
    const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
        return true;
    } else {
        return false;
    }
}
