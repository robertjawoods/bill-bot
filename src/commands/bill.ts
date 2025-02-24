import {
    EmbedBuilder,
    SlashCommandIntegerOption,
    SlashCommandStringOption,
    User,
    type CommandInteraction,
} from "discord.js";

import { Discord, Slash, SlashOption } from "discordx";
import moment from "moment";

const amount_option = new SlashCommandIntegerOption()
    .setName("amount")
    .setDescription("Amount to split.")
    .setRequired(true);

const description_option = new SlashCommandStringOption()
    .setName("description")
    .setDescription("Description of the bill.")
    .setRequired(true);

const due_date_option = new SlashCommandStringOption()
    .setName("due")
    .setDescription("Date the bill is due (YYYY-MM-DD).")
    .setRequired(true);

@Discord()
export class Bill {
    @Slash({ name: "bill", description: "Split a bill with a friend." })
    async bill(
        @SlashOption(amount_option) amount: number,
        @SlashOption(description_option) description: string,
        @SlashOption(due_date_option) dueDate: string,
        interaction: CommandInteraction,
    ): Promise<void> {
        await interaction.deferReply();

        var date = moment(dueDate).format("DD/MM/yy");

        const user = interaction.user as User;
        const halfAmount = (amount / 2).toFixed(2);

        const embed = new EmbedBuilder()
            .setTitle("Bill Details")
            .setColor("Blue")
            .addFields([
                { name: "Amount", value: `£${amount}` }, 
                { name: "Bill Type", value: description },
                { name: "Split Amount", value: `£${halfAmount}` },
                { name: "Due Date", value: `${date.toLocaleString()}` }, 
                { name: "Pay", value: `[Link](https://monzo.me/${process.env.MONZO_USERNAME}/${halfAmount}?d=${encodeURIComponent(description)})` }
            ])
            .setTimestamp()
            .setDescription(`Each owes £${halfAmount} for **${description}**.`)
            .setFooter({ text: `Bill created by ${user.tag}` });

        const response = await interaction.editReply({ embeds: [embed] });
        response.react("✅");
    }
}