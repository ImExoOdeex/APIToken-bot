import dotenv from 'dotenv'
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js'
import commands from "./commands/commands.json"
import { generateTokenCommand } from './commands/generatetoken'
dotenv.config()

const client: Client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.MessageContent
    ]
})

client.on("ready", async () => {
    console.log("client.guilds.cache.size", client.guilds.cache.size);

    console.log("bot ready");
})

client.on("warn", async (event) => {
    console.warn(event);
})

client.on("error", (event) => {
    console.error(JSON.stringify(event));
})

const TOKEN = process.env.DISCORD_TOKEN
if (!TOKEN) throw new Error("TOKEN is not set!")
const TOKEN_DEV = process.env.DISCORD_TOKEN_DEV
if (!TOKEN_DEV) throw new Error("TOKEN_DEV is not set!")

const rest = new REST({ version: '10' }).setToken(
    process.env.NODE_ENV == "development" ?
        TOKEN_DEV
        : TOKEN
)

client.on("interactionCreate", async (interaction) => {

    if (!interaction.isChatInputCommand()) return
    switch (interaction.commandName) {
        case "generatetoken": {
            await generateTokenCommand(interaction)
            break
        }
        default: {
            console.log("no command");
        }
    }

})

async function main() {

    try {
        if (!process.env.CLIENT_ID) throw new Error("CLIENT_ID is not definied")
        if (!process.env.CLIENT_ID_DEV) throw new Error("CLIENT_ID_DEV is not definied")

        await rest.put(Routes.applicationCommands(
            process.env.NODE_ENV == "development" ?
                process.env.CLIENT_ID_DEV
                : process.env.CLIENT_ID
        ), {
            body: commands
        }).catch(err => console.error("Error in `rest.put`: ", err))

        client.login(
            process.env.NODE_ENV == "development" ?
                TOKEN_DEV
                : TOKEN
        )
    } catch (err) {
        console.error(err);
    }
}

main().catch(() => console.log("Bot crashed ;d"))