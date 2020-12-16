import axios from "axios";
import { DISCORD_API } from "../../constants";
import { Plexi } from "../../Plexi";
import { InteractionData } from "../../slash/SlashCommand";

export default async function (client: Plexi, data: InteractionData): Promise<void> {
    // Get the name of the slash command that was run
    const name = data.data.name;

    client.emit("debug", `Running slash command ${name}`);

    // Look it up and run the handler
    const response = await client.slashCommands.get(name.toLowerCase()).handler(data, data.data.options);

    // If the handler returned any data run the callback with it
    if (response) {
        await axios({
            method: "post",
            url: `${DISCORD_API}/interactions/${data.id}/${data.token}/callback`,
            data: response,
        });
    }
}
