import { Plexi } from "../../Plexi";
import { SlashCommand, SlashCommandResponse } from "../SlashCommand";

export default class HelloWorld extends SlashCommand {
    constructor(client: Plexi) {
        super(client, {
            name: "hello",
            description: "Say hello to the world",
        });
    }

    handler(): SlashCommandResponse {
        return {
            type: 3,
            data: {
                content: "Hello, World!",
            },
        };
    }
}
