const { MessageEmbed, Util } = require("discord.js");
const fetch = require('node-fetch');
const moment = require("moment");

const API_BASE = 'https://developer.mozilla.org';

module.exports = {
    name: "mdn",
    category: "Search",
    description: "Searche thorugh [mdn](https://developer.mozilla.org) docs.",
    usage: "<query>",
    cooldown: 10,
    execute
}

async function execute(client, message, args, instance) {
    if (!args[0]) return instance.send(message, instance.embed("Please provide a query to search.", "error"), "embed")
    const res = await searchDocs(message.text);
    if (!res.status) return instance.send(message, instance.embed("Unable to find any results for the given query.", "error"), "embed")
    if (res.documents.length == 0) return instance.send(message, instance.embed("Unable to find any results for the given query.", "error"), "embed")

    let embeds = [];
    const embed = new MessageEmbed()
        .setAuthor("MDN Documentation", "https://iili.io/BufHXt.jpg", "https://developer.mozilla.org")
        .setColor("#F9F8F8")
        .setTitle("Contents")
        .setURL(`${API_BASE}/search?q=${encodeURI(message.text)}`)
        .setDescription(res.documents.slice(0, 15).map((d, i) => `\`${++i})\` [${d.title}](${API_BASE}${d.mdn_url})`).join("\n"));

    res.documents.forEach(doc => {
        embeds.push(
            new MessageEmbed()
                .setAuthor("MDN Documentation", "https://iili.io/BufHXt.jpg", "https://developer.mozilla.org")
                .setColor("#F9F8F8")
                .setTitle(doc.title)
                .setURL(`${API_BASE}${doc.mdn_url}`)
                .setDescription(Util.splitMessage(doc.summary)[0])
                .addField("Popularity", doc.popularity.toFixed(2), true)
                .addField("Score", doc.score.toFixed(2), true)
                .addField("Archieved", doc.archived ? "Yes" : "No", true)
        )
    });

    instance.paginate(message, [embed, ...embeds]);
}

async function searchDocs(query) {
    const qString = `${API_BASE}/api/v1/search?q=${encodeURI(query)}`;

    try {
        const res = await fetch(qString).then(r => r.json());
        return { status: true, ...res }
    } catch (e) {
        console.log(e)
        return { status: false }
    }
}