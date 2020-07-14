Array.prototype.last = () => this[this.length - 1];

/* Returns an array of all the messages in a given channel, the zeroth element is the first message in that channel */
async function getMessages(channel) {
    let messages = [];

    // Get most recent message in channel
    const firstMessage = (await channel.messages.fetch({ limit: 2 })).first();
    messages.push(formatMessage(firstMessage));
    let pos = firstMessage.id;

    while (true) {
        const found = await channel.messages.fetch({ limit: 50, before: pos });
        if (found.array().length === 0) break;
        pos = found.last().id;
        messages = messages.concat(found.map(formatMessage));
        console.log(`Performing message jump [${formatSnowflake(found.last().id)}] | ${messages.length} messages found`);
    }

    messages.reverse();
    return messages;
}

export default class Archiver {
    client;
    whitelist;
    active = false;

    constructor(client, whitelist) {
        this.client = client;
        this.whitelist = whitelist;
    }

    async clone(originChannel, targetChannel, destinationChannel) {
        originChannel.send(`Starting clone from target ${targetChannel} to destination ${destinationChannel}`);
        this.active = true;

        const messages = await getMessages(targetChannel);
        let users = {};
        

        this.active = false;
    }

    async resume(originChannel, targetChannel, destinationChannel) {

    }
}