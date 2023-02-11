import dotenv from "dotenv"
import { APIEmbed, CommandInteraction } from "discord.js";
import { request } from "undici";
dotenv.config()

export async function deleteTokenCommand(interaction: CommandInteraction) {

    if (!interaction.memberPermissions?.has("ManageGuild")) {
        return await interaction.reply({
            embeds: [
                {
                    title: `Token generation for **${interaction.user.tag}**`,
                    color: 0x8689D1,
                    description: "You must have `ManageGuild` permission to delete the token!\n If you want to delete or regenerate your token please contact admin.",
                    thumbnail: {
                        url: interaction.user.avatarURL({ extension: "webp", size: 128 }) ?? "",
                        height: 128,
                        width: 128
                    }
                }
            ]
        })
    }

    if (!interaction.options.get("userid")) {
        return await interaction.reply({
            embeds: [
                {
                    title: `Token generation for **${interaction.user.tag}**`,
                    color: 0x8689D1,
                    description: "Please provide user ID to delete!",
                    thumbnail: {
                        url: interaction.user.avatarURL({ extension: "webp", size: 128 }) ?? "",
                        height: 128,
                        width: 128
                    }
                }
            ]
        })
    }

    const API_URL = process.env.API_URL
    if (!API_URL) throw new Error("THERES NO API_URL!")

    const token = await (await request(`${API_URL}/api/token/delete`, {
        method: "POST",
        body: JSON.stringify({
            userId: interaction.user.id
        }),
        headers: {
            "Authorization": process.env.SUPER_DUPER_API_ACCESS_TOKEN ?? ""
        }
    })).body.json()

    const errorDesc = `There was an error, please read the message:
    **_${token.message}_**`

    const normalDesc = `Token ${token.token} has been successfully deleted!`

    const embed: APIEmbed =
    {
        title: `Token generation for **${interaction.user.tag}**`,
        color: 0x8689D1,
        description: token.message ? errorDesc : normalDesc,
        thumbnail: {
            url: interaction.user.avatarURL({ extension: "webp", size: 128 }) ?? "",
            height: 128,
            width: 128
        }
    }

    return await interaction.reply({ embeds: [embed], ephemeral: true })
}