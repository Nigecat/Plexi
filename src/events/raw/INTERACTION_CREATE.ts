import { Plexi } from "../../Plexi";
import { ephemeral } from "../../slash/utils";
import { InteractionData, SlashCommandResponse } from "../../slash/SlashCommand";

export default async function (client: Plexi, data: InteractionData): Promise<void> {
    // Get the name of the slash command that was run
    const name = data.data.name.toLowerCase();

    client.emit("debug", `Running slash command ${name}`);

    let response: void | SlashCommandResponse;

    // If we can't find this command show an error
    if (!client.slashCommands.has(name)) {
        client.emit("error", new Error(`User attempted to run unkwnown slash command: ${name}`));
        response = ephemeral("I could not find a command with that name, it might no longer exist.");
    } else {
        // Otherwise look it up and run the handler
        response = await client.slashCommands.get(name).handler(data, data.data.options);
    }

    // If the handler returned any data run the callback with it
    if (response) {
        client.discord.interactions(data.id, data.token).callback.post({
            data: response,
        });
    }
}
