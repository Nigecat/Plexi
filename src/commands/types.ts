import { Plexi } from "../Plexi";
import { extractDigits } from "../utils/misc";
import { User, Message, GuildMember, Role } from "discord.js";

const argumentTypes: ArgumentTypes = {
    string: {
        validate: (): boolean => true,

        parse: (val: string): string => val,
    },

    boolean: {
        validate: (val: string): boolean => ["yes", "no", "true", "false"].includes(val.toLowerCase()),

        parse: (val: string): boolean => ["yes", "true"].includes(val.toLowerCase()),
    },

    user: {
        validate: (val: string, client: Plexi): boolean =>
            client.users.cache.has(extractDigits(val)) ||
            client.users.cache.some((user) => user.tag.toLowerCase() === val.toLowerCase()),

        parse: (val: string, client: Plexi): User =>
            client.users.cache.get(extractDigits(val)) ||
            client.users.cache.find((user) => user.tag.toLowerCase() === val.toLowerCase()),
    },

    number: {
        validate: (val: string): boolean =>
            val.trim() !== "" ? (Number.isFinite ? Number.isFinite(+val) : isFinite(+val)) : false,

        parse: (val: string): number => parseFloat(val),
    },

    member: {
        validate: (val: string, _: Plexi, message: Message): boolean =>
            message.guild.members.cache.has(extractDigits(val)) ||
            message.guild.members.cache.some((member) => member.user.tag.toLowerCase() === val.toLowerCase()),

        parse: (val: string, _: Plexi, message: Message): GuildMember =>
            message.guild.members.cache.get(extractDigits(val)) ||
            message.guild.members.cache.find((member) => member.user.tag.toLowerCase() === val.toLowerCase()),
    },

    role: {
        validate: (val: string, _: Plexi, message: Message): boolean =>
            message.guild.roles.cache.has(extractDigits(val)),

        parse: (val: string, _: Plexi, message: Message): Role => message.guild.roles.cache.get(extractDigits(val)),
    },
};

export default argumentTypes;

export interface ArgumentTypes {
    [type: string]: {
        validate: (val: string, client?: Plexi, message?: Message) => boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parse: (val: string, client?: Plexi, message?: Message) => any;
    };
}
