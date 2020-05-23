import { Message } from "discord.js";
import convert from "convert-units";
import Command from "../../util/Command.js";

export default <Command> {
    args: ["value", "from-unit", "to-unit"],
    description: "Convert a value from one unit to another (e.g convert 4 lb kg)",
    call (message: Message, args: any[]): void {
        try {
            const from: any = convert().describe(args[1]);
            const to: any = convert().describe(args[2]);
            const result: any = convert(Number(args[0])).from(args[1]).to(args[2]);
            message.channel.send(`**Converting:** ${args[0]} ${from.plural} to ${to.plural}\n**Result:** ${result} ${to.plural}`);
        } catch (err) {
            message.channel.send(`**Unrecognized unit conversion:** ${args[1]}/${args[2]}`);
        }
    }
}