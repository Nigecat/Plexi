
export default class Archiver {
    client;
    whitelist;
    active = false;

    constructor(client, whitelist) {
        this.client = client;
        this.whitelist = whitelist;
    }

    startClone(targetChannel, destinationChannel) {

    }

    resumeClone(targetChannel, destinationChannel) {

    }
}