import message from "./message";
import { Plexi } from "../Plexi";
import guildMemberAdd from "./guildMemberAdd";
import voiceStateUpdate from "./voiceStateUpdate";
import INTERACTION_CREATE from "./raw/INTERACTION_CREATE";

export const events: Record<string, EventHandler> = {
    message,
    guildMemberAdd,
    voiceStateUpdate,
};

export const rawEvents: Record<string, RawEventHandler> = {
    INTERACTION_CREATE,
};

export interface EventHandler {
    (client: Plexi, [...data]: unknown[]): void;
}

export interface RawEventHandler {
    (client: Plexi, data: unknown): void;
}
