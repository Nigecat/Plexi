import { create, all } from "mathjs";
import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

const math = create(all, {});
const limitedEvaluate = math.evaluate;
math.import(
    {
        import: function () {
            throw new Error("Function import is disabled");
        },
        createUnit: function () {
            throw new Error("Function createUnit is disabled");
        },
        evaluate: function () {
            throw new Error("Function evaluate is disabled");
        },
        parse: function () {
            throw new Error("Function parse is disabled");
        },
        simplify: function () {
            throw new Error("Function simplify is disabled");
        },
        derivative: function () {
            throw new Error("Function derivative is disabled");
        },
    },
    { override: true },
);

export default class Math extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "math",
            group: "General",
            description: "Solve a math equation",
            args: [
                {
                    type: "string",
                    name: "equation",
                    infinite: true,
                },
            ],
        });
    }

    run(message: Message, [equation]: [string]): void {
        try {
            message.channel.send(`\`${equation}\` = \`${limitedEvaluate(equation)}\``);
        } catch {
            message.channel.send("Something went wrong when I tried to solve that...");
        }
    }
}
