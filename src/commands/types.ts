import { Plexi } from "../Plexi";
import { User } from "discord.js";
import { extractDigits } from "../utils/misc";

const argumentTypes: ArgumentTypes = {
    string: {
        validate: (): boolean => true,
        parse: (val: string): string => val,
    },
    user: {
        validate: (val: string, client: Plexi): boolean => client.users.cache.has(extractDigits(val)),
        parse: (val: string, client: Plexi): User => client.users.cache.get(extractDigits(val)),
    },
    number: {
        validate: (val: string): boolean =>
            val.trim() !== "" ? (Number.isFinite ? Number.isFinite(+val) : isFinite(+val)) : false,
        parse: (val: string): number => parseFloat(val),
    },
};

export default argumentTypes;

export interface ArgumentTypes {
    [type: string]: {
        validate: (val: string, client: Plexi) => boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parse: (val: string, client: Plexi) => any;
    };
}
