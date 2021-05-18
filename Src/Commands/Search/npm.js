const { MessageEmbed, } = require("discord.js");
const npmSearch = require('libnpmsearch');
const moment = require("moment");

module.exports = {
    name: "npm",
    category: "Search",
    description: "Searches [NPM](https://www.npmjs.com) packages.",
    usage: "<packageName> [--card]",
    cooldown: 10,
    execute
}

async function execute(client, message, args, instance) {
    const { guild, channel, author, member } = message;
    if (!args[0]) return instance.send(message, instance.embed("Please provide a package name to search.", "error"), "embed")
    const { get, sanitizedText } = instance.parseFlags(message.text)

    const search = await npmSearch(sanitizedText);
    if (search.length == 0) return instance.send(message, instance.embed(`Unable to find the package with that name.`, "error"), "embed")
    const package = search[0];

    const embed = new MessageEmbed()
        .setAuthor("NPM", "https://i.imgur.com/ErKf5Y0.png", "https://www.npmjs.com")
        .setTitle(package.name)
        .setURL(`https://www.npmjs.com/package/${package.name}`)
        .setDescription(package.description || "No Discription")
        .addField("Version", package.version, true)
        .addField("Author", package.author ? `${package.author.name || "Unknown"}` : "Unknown", true)
        .addField("Modification Date", moment(package.date ? package.date : new Date().toISOString()).format("DD/MM/YYYY"), true)
        .addField("Maintainers", package.maintainers ? package.maintainers.map(m => m.username).join(", ") : "None")
        .setColor("#CB0000");

    if (get("card")) embed.setImage(`https://nodei.co/npm/${package.name}.png?downloads=true&downloadRank=true&stars=true`)
    else embed.setImage(instance.config.apiUrl + `/npm?package=${package.name}`)

    instance.send(message, embed, "embed");
}