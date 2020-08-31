import { Plexi } from "../../../Plexi";
import { DMChannel, Message } from "discord.js";
import { User as DiscordUser } from "discord.js";
import { Card } from "../../../managers/CardManager";
import { User } from "../../../managers/DatabaseManager";

export class GameUser {
    public dbData: User;
    public dmChannel: DMChannel;
    public hand: Card[];
    public playedCards: Card[];
    public deckContent: Message;
    public wins: number;
    public passed: boolean;
    // Users may bet either a card or coins
    public bet: string | number;

    constructor(public client: Plexi, public user: DiscordUser) {
        this.wins = 0;
        this.passed = false;
        this.playedCards = [];
    }

    async init(): Promise<void> {
        // Lock the user account
        this.dbData = await this.client.database.getUser(this.user.id);
    }

    async lock(): Promise<void> {
        await this.client.database.updateUser(this.user.id, "lock", true);
    }

    async unlock(): Promise<void> {
        await this.client.database.updateUser(this.user.id, "lock", false);
    }
}
