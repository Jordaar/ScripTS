const { MessageEmbed, Message, Collection } = require("discord.js");
const { Client: client } = require("../../../index");
const config = require("../../../config");

/**
 * 
 * @param {Client} client 
 * @param {Message} message
 */

async function send(message, payload, type) {
    let outMsg = null;
    try {
        const checkExist = client.exeCmd.get(message.id);
        if (checkExist) {
            const tMsg = await message.channel.messages.fetch(checkExist.id);
            outMsg = tMsg;
            if (tMsg && tMsg.editable && tMsg.author.id == client.user.id) {
                switch (type ? type.toLowerCase() : undefined) {
                    case "embed":
                        outMsg = await tMsg.edit({
                            content: null,
                            embed: payload
                        })
                        break;

                    case "string":
                        outMsg = await tMsg.edit({
                            content: payload,
                            embed: null
                        })
                        break;

                    default:
                        outMsg = await tMsg.edit(payload)
                        break;
                }
            }
        }
        else {
            const msg = await message.channel.send(payload);
            outMsg = msg;
            client.exeCmd.set(message.id, msg);

            setTimeout(() => {
                client.exeCmd.delete(message.id)
            }, 1000 * 60 * 5);
        }
        return outMsg;
    } catch (e) {
        console.log(e);
        return outMsg = null;
    }
}

/**
 * 
 * @param {String} text 
 * @param {String} type
 */
function embed(text, type) {
    const embed = new MessageEmbed();
    switch (type ? type.toLowerCase() : undefined) {
        case "success":
            embed.setDescription(`${config.static.emojis.success} ${text || "Success"}`)
                .setColor(config.static.color.success);
            break;

        case "error":
            embed.setDescription(`${config.static.emojis.error} ${text || "Error"}`)
                .setColor(config.static.color.error);
            break;

        case "info":
            embed.setDescription(`${config.static.emojis.info} ${text || "Information"}`)
                .setColor(config.static.color.info);
            break;

        default:
            embed.setDescription(`${config.static.emojis.success} ${text || "Success"}`)
                .setColor(config.static.color.success);
            break;
    }
    return embed;
}

module.exports = {
    send: send,
    embed: embed,
    paginate: require("./Pagination/paginate")
}