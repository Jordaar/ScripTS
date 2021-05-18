const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const moment = require("moment");

module.exports = {
    name: "pypi",
    category: "Search",
    description: "Search for [pypi](https://pypi.org) projects.",
    usage: "<projectName>",
    cooldown: 10,
    execute
}

async function execute(client, message, args, instance) {
    if (!args[0]) return instance.send(message, instance.embed("Please provide a project name to search.", "error"), "embed")
    const res = await fetchPypi(message.text);
    if (!res.status) return instance.send(message, instance.embed("Unable to find any pypi projects.", "error"), "embed")

    const embed = new MessageEmbed()
        .setColor("#006DAD")
        .setAuthor("PyPi", "https://iili.io/BTwS07.png", "https://pypi.org")
        .setTitle(res.info.name || "Unknown")
        .setURL(res.info.project_url)
        .setDescription(res.info.summary || "No Description")
        .addField("Version", res.info.version || "UNKNOWN", true)
        .addField("Author", res.info.author, true)
        .addField("Released", `${releases(res)[0].date} \`(Total : ${releases(res).length})\``, true)
        .addField("Required Py Version", res.info.requires_python || "UNKNOWN", true)
        .addField("License", res.info.license || "UNKNOWN", true)
        .addField("Releases", releases(res).map(x => `\`${x.version}\` on ${x.date}`).slice(0, 5).join("\n"), false);

    if (res.info.home_page && res.info.home_page.startsWith("https://github.com")) {
        const split = res.info.home_page.replace("https://github.com/", "").split("/")
        embed.setImage(`${instance.config.apiUrl}/github-repo?username=${split[0]}&repo=${split[1].replace(".git", "")}&hide_border=true&theme=tokyonight`)
    }

    instance.send(message, embed, "embed")
}

async function fetchPypi(packageName) {
    try {
        const res = await fetch(`https://pypi.org/pypi/${packageName}/json`)
            .then(r => r.json());
        return { status: true, ...res }
    } catch (e) {
        return { status: false }
    }
}

function releases(data) {
    return Object.keys(data.releases).reverse().map((x, i) => {
        let release = data.releases[x];
        if (!release[0]) return {
            version: x,
            date: "Unknown"
        }
        release = release[0];
        return {
            version: x,
            date: release.upload_time ? `${moment(release.upload_time).format("MMM D, YYYY")}` : "Unknown"
        }
    })
}