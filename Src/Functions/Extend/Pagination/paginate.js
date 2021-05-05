const { Message } = require("discord.js");
const Pagination = require("discord-paginationembed");

const infoEmbed = require("./Embeds/Info_Embed");

/**
 * 
 * @param {Message} message 
 * @param {Array} embeds 
 */

async function paginate(message, embeds) {
    const { author, channel } = message;
    embeds.map((e, i) => e.setFooter(`Page -> ${++i} | ${embeds.length}`))
    embeds.push(infoEmbed);

    const m = new Pagination.Embeds()
        .setArray(embeds)
        .setAuthorizedUsers([author.id])
        .setChannel(channel)
        .setTimeout(1000 * 60 * 5)
        .setPageIndicator(false)
        .setPage(1)
        .setColor("#191A26")
        .setTimestamp()
        .setDisabledNavigationEmojis(["all"])
        .setClientAssets({ prompt: `To what page would you like to go?` })
        .setFunctionEmojis({
            "⏮️": (_, instance) => { //1st page
                instance.setPage(1)
            },
            "◀️": (_, instance) => { //Previous Page
                if (instance.page === 1) return;
                instance.setPage(instance.page - 1)
            },
            "▶️": (_, instance) => { //Next Page
                if (instance.page == embeds.length) return instance.setPage(embeds.length - 1)
                instance.setPage(instance.page + 1)
            },
            "⏭️": (_, instance) => { //Last Page
                instance.setPage(embeds.length - 1)
            },
            "↗": (_, instance) => { //Jump Page
                //default
            },
            "⏹": (_, instance) => { //Delete | Over
                message.react("✅").catch(e => { });
                instance.clientAssets.message.delete();
                return Promise.reject('stopped')
            },
            "ℹ": (_, instance) => { //Info
                instance.setPage(embeds.length);
            }
        })
    await m.build().catch(e => { console.log(e) });
    return m;
}

module.exports = paginate;
