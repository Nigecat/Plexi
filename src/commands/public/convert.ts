import { Message } from "discord.js";
import convert from "convert-units";

export default {
    args: ["value", "from-unit", "to-unit"],
    description: "Convert a value from one unit to another (e.g convert 4 lb kg)",
    call (message: Message, args: any[]) {
        try {
            const from: any = convert().describe(args[1]);
            const to: any = convert().describe(args[2]);
            const result: any = convert(Number(args[0])).from(from.abbr).to(to.abbr);
            message.channel.send(`**Converting:** ${args[0]} ${from.plural} to ${to.plural}\n**Result:** ${result} ${to.plural}`);
        } catch (err) {
            message.channel.send(`**Unrecognized unit conversion:** ${args[1]}/${args[2]}`);
        }
    }
}