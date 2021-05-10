const { MessageEmbed } = require("discord.js");
const fetch = require('node-fetch');
const queryString = require("querystring");
const moment = require("moment");

module.exports = {
    name: "stack",
    aliases: ["stackoverflow", "stack-overflow"],
    category: "Search",
    description: "Searches thorugh [Stack Overflow](https://stackoverflow.com).",
    usage: "<query> [--tagged=tag1;tag2]",
    cooldown: 15,
    execute
}

async function execute(client, message, args, instance) {
    if (!args[0]) return instance.send(message, instance.embed("Please provide a query to search.", "error"), "embed")
    const res = await searchStack(message.text);
    if (!res.status) return instance.send(message, instance.embed("Unable to find any results for the given query.", "error"), "embed")
    if (res.items.length == 0) return instance.send(message, instance.embed("Unable to find any results for the given query.", "error"), "embed")

    let embeds = [];
    res.items.forEach(async (item) => {
        const embed = new MessageEmbed()
            .setColor("#F48023")
            .setThumbnail("https://iili.io/BuS6UQ.png")
            .setAuthor("Stack Overflow", "https://iili.io/BuS6UQ.png", "https://stackoverflow.com")
            .setTitle(item.title)
            .setDescription(`This question ${item.is_answered ? "was answered" : "is not answered"}.`)
            .setURL(item.link)
            .addField("Owner", `${item.owner.display_name}`, true)
            .addField("Creation Date", moment.unix(item.creation_date).format("MMM D, YYYY"), true)
            .addField("Last Active", moment.unix(item.last_activity_date).format("MMM D, YYYY"), true)
            .addField("Views", item.view_count, true)
            .addField("Tags", item.tags.join(", ") || "None", true);
        embeds.push(embed)
    });

    instance.paginate(message, embeds);

    async function searchStack(query) {
        const API_Base = "https://api.stackexchange.com/2.2/search/advanced";
        const { sanitizedText, get } = instance.parseFlags(query);

        try {
            const qs = queryString.stringify({
                key: "U4DMV*8nvpm3EOpvf69Rxw((",
                q: sanitizedText,
                order: "desc",
                sort: "activity",
                site: "stackoverflow",
                tagged: get("tagged") || ""
            });
            const res = await fetch(`${API_Base}?${qs}`).then(r => r.json());
            if (res.error_id) return { status: false }
            return { status: true, ...res }
        } catch (e) {
            return { status: false }
        }
    }
}