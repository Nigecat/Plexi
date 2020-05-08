
module.exports = {
    args: ["<limit>"],
    perms: ["ADMINISTRATOR"],
    description: "Delete the <limit> most recent messages in the current channel",
    call: function(message, limit) {
        if (!isNaN(limit)) {
            limit = parseInt(limit);
            if (limit <= 100) {
                message.channel.bulkDelete(limit).then(() => {
                    console.log(`[status] Deleted ${limit} messages`);
                });
            } else {
                message.channel.send("Purge size must be 100 messages or fewer!");
            }
        } else {
            message.channel.send("Limit must be a number!");
        }
    }
}