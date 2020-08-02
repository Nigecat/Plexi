import { Message } from "discord.js";
import { PlexiClient } from "./client";

export const ARGUMENT_TYPES: ArgumentTypes = {
    number: {
        check: (val: string) => {
            if (typeof val === "number") {
                return val - val === 0;
            }
            if (typeof val === "string" && val.trim() !== "") {
                return Number.isFinite ? Number.isFinite(+val) : isFinite(+val);
            }
            return false;
        },

        format: (val: string) => {
            return val;
        }
    }
}

export interface ArgumentTypes {
    [type: string]: {
        check: (val: string, data: { message: Message, client: PlexiClient }) => boolean,
        format: (val: string) => any
    }
}