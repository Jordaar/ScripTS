const guildSchema = require("../../Database/Schemas/guildSchema");

module.exports = {
    name: "prefix",
    category: "Configuration",
    description: "Used to set the bot's prefix.",
    memberPermissions: ["MANAGE_GUILD"],
    cooldown: 30,
    execute
}

async function execute(client, message, args, text, instance) {
    const { guild } = message;
    if (!args[0]) return instance.send(message, instance.embed(`My prefix in this server is **${client.prefix.get(guild.id)}** and ${guild.me.toString()}.\n> Use: ${client.prefix.get(guild.id)}prefix newPrefix to change the prefix!`, "info").setFooter("Replace newPrefix with the desired prefix."));
    const guildConfig = await guildSchema.findOne({ guildId: guild.id });

    if (guildConfig) {
        await guildSchema.findOneAndUpdate({
            guildId: guild.id
        }, {
            prefix: args[0],
            lastUpdated: new Date().toISOString()
        });
        instance.send(message, instance.embed(`Prefix changed to **${args[0]}**`, "success"));
    }

    else {
        const entry = {
            guildId: guild.id,
            prefix: args[0]
        }
        await new guildSchema(entry).save();
        instance.send(message, instance.embed(`Prefix changed to **${args[0]}**`, "success"));
    }

    client.prefix.set(guild.id, args[0])
}