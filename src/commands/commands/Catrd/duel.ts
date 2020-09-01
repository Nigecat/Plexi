import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";
import { confirm } from "../../../utils/misc";
import { GameState } from "../../extras/duel/GameState";
import { Message, User, TextChannel, NewsChannel, MessageEmbed, MessageReaction } from "discord.js";

export default class Duel extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "duel",
            group: "Catrd",
            description: "Fight another user in the ring of honor!",
            details: stripIndents`
                Fight another user, at the start of the duel both users place a bet.
                This bet can either be coins of a card.
                The winner takes the loser's bet.

                When a duel is started, 7 cards will be picked at random from your deck (run \`mycards\` to view your deck).
            `,
            guildOnly: true,
            args: [
                {
                    name: "user",
                    type: "user",
                },
            ],
        });
    }

    async run(message: Message, [user]: [User]): Promise<void> {
        const game = new GameState(
            this.client,
            (message.channel as unknown) as TextChannel | NewsChannel,
            message.author,
            user,
        );

        // Init the game and run all pre-game checks
        try {
            await game.init();
        } catch (err) {
            message.channel.send(err.message);
            // Unlock the accounts
            await game.initiator.unlock();
            await game.target.unlock();
            return;
        }

        await message.channel.send({
            embed: {
                color: "#ff0000",
                description: stripIndents`
                    NOTE: While you are in a duel, your user account gets locked.
                    Any changes to your cards, coins or other data **WILL NOT** go through.
                    It may look like it went through but no changes will be applied.
                `,
            },
        });

        // All pre-game checks should have passed if we get here
        // Next we confirm if the user is willing to accept the duel
        const confirmation = await message.channel.send(
            `${user}, ${message.author.username} is requesting to duel you. If you wish to accept react to this message with a 🇾.`,
            { allowedMentions: { users: [user.id] } },
        );
        // If the confirmation does not pass
        if (!(await confirm(user.id, confirmation))) {
            await confirmation.edit("Duel cancelled! (HINT: The duel request times out after not too long)");
            // Unlock the accounts
            await game.initiator.unlock();
            await game.target.unlock();
            return;
        }

        await confirmation.delete();

        // Now that both users should be wanting to duel
        // We can then get a bet for each user
        try {
            await game.getBet();
        } catch (err) {
            message.channel.send("The duel has been cancelled.");
            // Unlock the accounts
            await game.initiator.unlock();
            await game.target.unlock();
            return;
        }

        // Confirm the bets
        const betConfirm = await message.channel.send(
            stripIndents`
                **Current bets are:**
                ${message.author}: ${
                typeof game.initiator.bet === "number" ? `${game.initiator.bet} coins` : game.initiator.bet
            }
                ${user}: ${typeof game.target.bet === "number" ? `${game.target.bet} coins` : game.target.bet}

                Could both users now react with whether they agree with this bet. 
                If either user reacts with 🇳 the duel will be cancelled. 
            `,
            { allowedMentions: { users: [message.author.id, user.id] } },
        );
        await betConfirm.react("🇾");
        await betConfirm.react("🇳");
        const response = await betConfirm.awaitReactions(
            (reaction: MessageReaction, reactUser: User) =>
                ["🇳", "🇾"].includes(reaction.emoji.name) && [message.author.id, user.id].includes(reactUser.id),
            { max: 2, time: 60000 },
        );

        await betConfirm.reactions.removeAll();

        // If any of the reactions aren't yes or we don't get enough of them
        if (
            response.has("🇳") &&
            response.get("🇳").users.cache.filter((user) => [message.author.id, user.id].includes(user.id)).size > 0
        ) {
            await betConfirm.edit("Duel cancelled! (HINT: The bet confirmation times out after not too long)");
            // Unlock the accounts
            await game.initiator.unlock();
            await game.target.unlock();
            return;
        }

        // Finally start the game
        const embed = new MessageEmbed({
            color: "#ff0000",
            title: `⚔️  Initiating duel between ${message.author.username} and ${user.username}  ⚔️`,
            description: stripIndents`
                So... how does this work?
                
                Both duel participants will have now been sent a list of 7 cards, this is your hand.
                The game is turn based, the current turn is displayed at the bottom of the game board.
                The game board will be updated as the game progressing. Keep an eye on it.
                The game has 'rounds', and round ends when both users have passed.
    
                When it is your turn, playing a card is as simple as typing the name of the card into the channel where the board is.
                To pass just type 'pass' in the channel where the board is.
                If a user runs out of cards in their hand they will automatically pass.
                Once both users have passed, the user with the highest current total power on their side of the board will win the round. (This is the accumulative power of all the cards on their side)
                
                The total round wins can be seen at the top of the board next to the usernames.
                The total played power is at the bottom.

                Certain cards may have abilities that have side effects once played. 
                These will be marked in the hand you were sent. Run \`abilityinfo\` to check what an ability does (this works in dms).
                
                Whoever has the current turn may type \`refresh\` in the this channel to send a new message with the board.
                This is for longer duels so you don't have to scroll upwards as far.

                The first user to two round wins will win the overall game.
                Good luck!
            `,
        });
        await message.channel.send({ embed });
        game.start();
    }
}
