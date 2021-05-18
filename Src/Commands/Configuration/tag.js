const { MessageEmbed, } = require("discord.js");


module.exports = {
    name: "tag",
    aliases: ["tags"],
    category: "Configuration",
    description: "Used to create custom commands in the server.",
    usage: "<arg>",
    cooldown: 10,
    enabled: false,
    execute
}

async function execute(client, message, args, instance) {

    // WIP!
}

