const { MessageEmbed } = require("discord.js");
const axios = require("axios");
const moment = require("moment");

module.exports = {
    name: "vscode",
    aliases: ["vs-code", "visualstudiocode", "vsc"],
    category: "Search",
    description: "Searches [Visual Studio Code](https://marketplace.visualstudio.com) extensions.",
    usage: "<extensionName>",
    cooldown: 10,
    execute: execute
}

async function execute(client, message, args, instance) {
    if (!args[0]) return instance.send(message, instance.embed("Please provide a extension name to search.", "error"), "embed");

    const res = await getExtension(message.text);
    if (!res.status) return instance.send(message, instance.embed("An error occured while processing your request.", "error"), "embed");
    if (res.results.length == 0) return instance.send(message, instance.embed("Unble to find any search results for the given query.", "error"), "embed");
    if (res.results[0].extensions.length == 0) return instance.send(message, instance.embed("Unble to find any search results for the given query.", "error"), "embed");
    const extension = res.results[0].extensions[0];

    const embed = new MessageEmbed()
        .setColor("#007ACC")
        .setAuthor("Visual Studio Code Marketplace", "https://iili.io/BTQFAx.png", "https://marketplace.visualstudio.com")
        .setTitle(extension.displayName)
        .setURL(`https://marketplace.visualstudio.com/items?itemName=${extension.publisher.publisherName}.${extension.extensionName}`)
        .setThumbnail(extension.versions[0].files.find(f => f.assetType == "Microsoft.VisualStudio.Services.Icons.Default" || f.assetType == "Microsoft.VisualStudio.Services.Icons.Small") ? extension.versions[0].files.find(f => f.assetType == "Microsoft.VisualStudio.Services.Icons.Default" || f.assetType == "Microsoft.VisualStudio.Services.Icons.Small").source : "https://iili.io/BuFyiu.png")
        .setDescription(extension.shortDescription || "No Description")
        .addField("Version", extension.versions[0].version, true)
        .addField("Author", extension.publisher.displayName, true)
        .addField("Category", extension.categories ? extension.categories.join(", ") : "None", true)
        .addField("Tags", extension.tags ? extension.tags.join(", ") : "None", false);
    let stats = [];
    if (extension.statistics) {
        stats.push(`**Released On**: ${moment(extension.releaseDate).format("DD/MM/YYYY, h:mm:ss A")}`)
        stats.push(`**Last Updated**: ${moment(extension.lastUpdated).format("DD/MM/YYYY, h:mm:ss A")}`)
        if (extension.statistics.find(s => s.statisticName == "install")) stats.push(`**Installs**: ${extension.statistics.find(s => s.statisticName == "install").value}`);

    }
    embed.addField("Statistics", stats.map(x => `> ${x}`).join("\n") || "None", false);

    instance.send(message, embed, "embed")
}

async function getExtension(query) {
    const API_URL = "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery";
    try {
        let status = false;
        let obj = await axios({
            data: {
                filters: [{
                    criteria: [{
                        filterType: 10,
                        value: query
                    }]
                }],
                flags: 0x2 | 0x4 | 0x100
            },
            headers: {
                accept: 'application/json; api-version=3.0-preview',
                'accept-encoding': 'gzip',
                'content-type': 'application/json; api-version=3.0-preview.1'
            },
            url: API_URL,
            method: 'POST'
        });
        if (obj.status == 200) {
            status = true;
            obj = await obj.data;
        }
        return { status, ...obj }
    } catch (e) {
        console.log(e)
        return { status: false }
    }
}