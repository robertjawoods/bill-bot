import {IntentsBitField} from "discord.js";
import {Client} from "discordx";
import {dirname, importx} from "@discordx/importer";
import express from 'express';

import 'dotenv/config'

export class Main {
  private static _client: Client;

  private static app = express();

  static get Client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    this._client = new Client({
      // botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
      intents: [
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,

      ],
      silent: false,
      botGuilds: ["1340732544034799646"]
    });

    this.Client.on("ready", async () => {
      await this.Client.initApplicationCommands();
      console.log("Bot started...");


    });

    this.Client.on("messageReactionAdd", (reaction, user) => {
      this.Client.executeReaction(reaction, user);
    });

    this.Client.on("interactionCreate", (interaction) => {
      this.Client.executeInteraction(interaction);
    });

    await importx(`${dirname(import.meta.url)}/**/**/*.{js,ts}`);

    // let's start the bot
    if (!process.env.BOT_TOKEN) {
      throw Error("Could not find BOT_TOKEN in your environment");
    }

    this.app.use(express.json());

    this.app.get("/healthz", (req, res) => {
      res.sendStatus(200);
    })

    this.app.listen("4000", () => {
      console.log("Listening on 4000")
    })

    await this._client.login(process.env.BOT_TOKEN);
  }
}

void Main.start();