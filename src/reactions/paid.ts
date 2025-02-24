import { MessageReaction, User, userMention } from "discord.js";
import { Client, Discord, Guard, Next, Reaction } from "discordx";

@Discord()          
class PaidReaction {
    @Reaction({ emoji: "✅" })
    paid(reaction: MessageReaction, user: User): void {
        if (user.bot) {
            return;
        }

        console.log("User has paid their share of the bill.");

        const message = reaction.message;

        message.reply(`${userMention(user.id)} has paid their share of this bill.`);
    }
}
