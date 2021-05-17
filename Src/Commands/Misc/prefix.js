module.exports = {
    name: "prefix",
    category: "Misc",
    description: "Shows the bot's prefix.",
    cooldown: 10,
    execute
}

async function execute(client, message, args, instance) {
    const { guild } = message;

    instance.send(message, instance.embed(`My prefix in this server is **${client.prefix.get(guild.id)}** and ${guild.me.toString()}.\n> Use: ${client.prefix.get(guild.id)}setprefix newPrefix to change the prefix!`, "info").setFooter("Replace newPrefix with the desired prefix."));
}