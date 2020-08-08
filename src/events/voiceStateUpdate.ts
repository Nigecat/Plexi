import { Plexi } from "../Plexi";
import { VoiceState, VoiceChannel, Snowflake } from "discord.js";

export default async function (client: Plexi, [state]: [VoiceState]): Promise<void> {
    // If we are in a voice channel
    if (state.guild.me.voice && state.guild.me.voice.channel) {
        // If we are the only user in the voice channel
        if (isAlone(client.user.id, state.guild.me.voice.channel)) {
            // Diconnect from the vc after 60 seconds if it is still just us
            setTimeout(() => {
                // If we are still in a voice channel (we may have been force disconnected)
                if (state.guild.me.voice && state.guild.me.voice.channel) {
                    if (isAlone(client.user.id, state.guild.me.voice.channel)) {
                        state.guild.me.voice.channel.leave();
                    }
                }
            }, 60000);
        }
    }
}

/** Check if a user is alone in a voice channel */
function isAlone(user: Snowflake, channel: VoiceChannel): boolean {
    return channel.members.size === 1 && channel.members.first().id === user;
}
