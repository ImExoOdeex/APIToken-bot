import dotenv from "dotenv"
import { APIEmbed, CommandInteraction } from "discord.js";
import { request } from "undici";
dotenv.config()

export async function generateTokenCommand(interaction: CommandInteraction) {
    const API_URL = process.env.API_URL
    if (!API_URL) throw new Error("THERES NO API_URL!")

    const token = await (await request(`${API_URL}/api/token/create`, {
        method: "POST",
        body: JSON.stringify({
            userId: interaction.user.id
        }),
        headers: {
            "Authorization": process.env.SUPER_DUPER_API_ACCESS_TOKEN ?? ""
        }
    })).body.json()

    console.log(token);

    const errorDesc = `There was an error, please read the message:
    **_${token.message}_**
    `

    const normalDesc = `Your new Token is:
    ||**${token.token}**||

    **Please do not share it to anyone!**
    If you want to reset your token, please contact admin!
    `

    const embed: APIEmbed =
    {
        title: `Token generation for **${interaction.user.tag}**`,
        color: 0x8689D1,
        description: token.message ? errorDesc : normalDesc,
    }

    return interaction.reply({ embeds: [embed] })
}