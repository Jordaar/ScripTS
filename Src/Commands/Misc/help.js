const { MessageEmbed } = require("discord.js");
const prettyMs = require("pretty-ms");
const config = require("../../../config");

module.exports = {
    name: "help",
    category: "Misc",
    description: "Shows the help menu of the bot.",
    usage: "[commandName]",
    execute: execute
}

let commands = {};
let url = null;

async function execute(client, message, args, instance) {
    let prefix = client.prefix.get(message.guild.id);
    if(!prefix) prefix = config.prefix;
    if (!url) url = await client.generateInvite({ permissions: ["ATTACH_FILES", "ADD_REACTIONS", "SEND_MESSAGES", "EMBED_LINKS"] })

    if (Object.keys(commands).length === 0) {
        client.commands.map(x => x).filter(c => c.enabled !== false).forEach((cmd) => {
            commands[cmd.category] ? commands[cmd.category].push(cmd) : commands[cmd.category] = [cmd];
        });
    }

    const helpMenu = new MessageEmbed()
        .setColor("#191A26")
        .setAuthor(message.member.displayName, message.author.displayAvatarURL())
        .setDescription(`Hey there 👋. I am **${client.user.username}**.\nRun ${prefix}help <commandName> for info about each command.`);

    Object.keys(commands).forEach((c) => {
        const cmd = commands[c];
        helpMenu.addField(`${c} Commands`, `>>> ${cmd.map((c) => `[${prefix}${c.name}](${url}) **-** ${c.description}`).join("\n")}`)
    });
     
    if (!args[0]) {
        instance.send(message, helpMenu, "embed");
    }
    else {
        const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));
        if (!cmd) return instance.send(message, helpMenu, "embed");

        const cmdMenu = new MessageEmbed()
            .setColor("#191A26")
            .setTitle(`Command: ${prefix}${cmd.name}`)
            .setDescription(cmd.description || "No description.")
            .addField("Category", cmd.category || "Unknown", true)
            .addField("Cooldown", cmd.cooldown === undefined ? "No cooldown" : `${prettyMs(cmd.cooldown * 1000, { verbose: true })}`, true)
        if (cmd.aliases) cmdMenu.addField("Aliases", cmd.aliases.join(", ") || "No aliases.", false)
        cmdMenu.addField("Usage", cmd.usage || "No usage.", false)
        if (cmd.memberPermissions && cmd.memberPermissions.length > 0) cmdMenu.addField("Required Permissions [Member]", cmd.memberPermissions.join(", ") || "None")
        if (cmd.botPermissions && cmd.botPermissions.length > 0) cmdMenu.addField("Required Permissions [Bot]", cmd.botPermissions.join(", ") || "None")

        instance.send(message, cmdMenu, "embed");
    }
}