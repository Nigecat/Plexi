import { Plexi } from "../../Plexi";
import { ephemeralHidden, user } from "../utils";
import { InteractionData, InteractionDataOptions, SlashCommand, SlashCommandResponse } from "../SlashCommand";

export default class GetID extends SlashCommand {
    constructor(client: Plexi) {
        super(client, {
            name: "getid",
            description: "Get the id of a user",
            options: [user("The user to get the id of")],
        });
    }

    handler(interaction: InteractionData, [{ value: user }]: InteractionDataOptions): SlashCommandResponse {
        return ephemeralHidden(user);
    }
}
