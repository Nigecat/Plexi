import message from "./message";
import { Plexi } from "../Plexi";
import guildMemberAdd from "./guildMemberAdd";
import voiceStateUpdate from "./voiceStateUpdate";

const events: Record<string, EventHandler> = {
    message,
    guildMemberAdd,
    voiceStateUpdate,
};

export default events;

export interface EventHandler {
    (client: Plexi, [...data]: unknown[]): void;
}
