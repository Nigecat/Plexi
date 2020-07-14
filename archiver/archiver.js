import { Message } from "discord.js";

export default class Archiver {
    client;
    whitelist;
    active = false;

    constructor(client, whitelist) {
        this.client = client;
        this.whitelist = whitelist;
    }

    startClone(originChannel, targetChannel, destinationChannel) {
        originChannel.send(`Starting clone from target ${targetChannel} to destination ${destinationChannel}`);

        
    }

    resumeClone(originChannel, targetChannel, destinationChannel) {

    }
}