import message from "./message";
import { Plexi } from "../Plexi";
import guildMemberAdd from "./guildMemberAdd";
import voiceStateUpdate from "./voiceStateUpdate";

export default <EventHandlers>{ message, guildMemberAdd, voiceStateUpdate };

export interface EventHandlers {
    [key: string]: EventHandler;
}

export interface EventHandler {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (client: Plexi, [...data]: any[]): void;
}
