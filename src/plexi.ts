import { logGreen } from "./util/colour.js";
import Discord from "discord.js";
const client = new Discord.Client();

export default class Plexi {
    private token: string;
    public owner: string;
    
    public constructor(token: string, owner: string) {
        this.token = token;
        this.owner = owner;
    }

    public start(): void {
        client.on("ready", this.ready.bind(this));
        client.on("debug", console.log);
        client.login(this.token);
    }

    private ready(): void {
        logGreen(`Logged in as ${client.user.tag} serving ${client.users.cache.size} users across ${client.channels.cache.size} channels in ${client.guilds.cache.size} servers`);
    }
}