const { Client, Collection } = require("discord.js");
const moment = require("moment");
const prettyMS = require("pretty-ms");
const config = require("../../config");
let instance = require("../Functions/Extend/instance");
const guildSchema = require("../Database/Schemas/guildSchema");

const cooldown = new Set();

/**
 * 
 * @param {Client} client 
 */

module.exports = async (client) => {

    setTimeout(async () => {
        const guildConfig = await guildSchema.find({});

        client.guilds.cache.forEach((guild) => {
            const thisGuild = guildConfig.find(g => g.guildId == guild.id);
            client.prefix.set(guild.id, thisGuild ? thisGuild.prefix : config.prefix);
        })
    }, 1000 * 60);

    client.on("message", (message) => {
        const { author, channel, guild, content, member } = message;
        if (author.bot) return;
        if (channel.type == "dm") return;
        if (!content) return;
        if (!guild) return;

        const mentionRegex = new RegExp(`^<@!?${client.user.id}> `);
        let prefix = content.match(mentionRegex) ? content.match(mentionRegex)[0] : client.prefix.get(guild.id) || config.prefix;
        if (!prefix) {
            prefix = config.prefix;
            client.prefix.set(guild.id , config.prefix);
        }
        if (!content.toLowerCase().startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        message.text = message.content.slice(prefix.length).replace(args[0], "").trim();
        const commandName = args.shift().toLowerCase();
        const cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!cmd) return;

        let options = {
            name: cmd.name,
            description: cmd.description || "No Description",
            usage: cmd.usage || "Not Usage",
            enabled: cmd.enabled || true,
            aliases: cmd.aliases || [],
            category: cmd.category || "Unknown",
            botPermissions: cmd.botPermissions || [],
            memberPermissions: cmd.memberPermissions || [],
            ownerOnly: cmd.ownerOnly || false,
            cooldown: cmd.cooldown || 0,
            execute: cmd.execute
        }

        if (config.devConfig.enabled) return channel.send(instance.embed(`${guild.me.toString()} is on dev mode. All commands are disabled.`, "error"))

        if (!guild.me.permissionsIn(channel).has("SEND_MESSAGES")) return author.send(instance.embed("I don't have permission to send messages in that channel.", "error"))
        if (!guild.me.hasPermission("EMBED_LINKS")) return channel.send("I require **Embed Links** permission in order to function correctly.")
        if (!guild.me.permissionsIn(channel).has("EMBED_LINKS")) return channel.send("I require **Embed Links** permission in order to function correctly.")
        if (!options.enabled) return instance.send(message, instance.embed("This command has been disabled.", "error"), "embed")
        if (options.ownerOnly && !config.devConfig.owners.includes(author.id)) return instance.send(message, instance.embed("Only the bot owners can use this command.", "error"), "embed")

        const cooldownEntries = [...cooldown];
        const checkCooldown = cooldownEntries.find(x => x.id == author.id && x.command == options.name);
        if (checkCooldown) return instance.send(message, instance.embed(`You are on a cooldown, Please wait for **${prettyMS(Math.abs(new Date() - new Date(checkCooldown ? checkCooldown.timeOver : new Date())))}**.`, "error"), "embed");
        const newCooldown = {
            id: author.id,
            command: options.name,
            timeOn: new Date().toISOString(),
            timeOver: moment().add(options.cooldown, 'seconds').toISOString()
        }
        if (options.cooldown !== 0) {
            cooldown.add(newCooldown);
            setTimeout(() => {
                cooldown.delete(newCooldown)
            }, options.cooldown * 1000);
        }

        const requiredPermBot = options.botPermissions.map(p => {
            return {
                name: p,
                display: `${guild.me.hasPermission(p) ? `${config.static.emojis.success}` : `${config.static.emojis.error}`} ${p}`,
                raw: `**−** ${p}`,
                missing: guild.me.hasPermission(p)
            }
        });
        if (requiredPermBot.map(x => x.missing).includes(false)) return instance.send(message, instance.embed(`I require the following perms for this command:\n${requiredPermBot.filter(x => !x.missing).map(x => x.raw).join("\n")}`, "error"));

        const requiredPermMember = options.memberPermissions.map(p => {
            return {
                name: p,
                display: `${member.hasPermission(p) ? `${config.static.emojis.success}` : `${config.static.emojis.error}`} ${p}`,
                raw: `**−** ${p}`,
                missing: member.hasPermission(p)
            }
        });
        if (requiredPermMember.map(x => x.missing).includes(false)) return instance.send(message, instance.embed(`You require the following perms in order to use this command:\n${requiredPermMember.filter(x => !x.missing).map(x => x.raw).join("\n")}`, "error"));

        instance.command = {
            ...options,
            prefix: prefix,
            isEdited: false
        }

        cmd.execute(client, message, args, instance);
    });

    client.on("messageUpdate", async (oldMessage, message) => {
        const command = client.exeCmd.get(message.id);
        if (!command) return;
        const { author, channel, guild, content } = message;
        if (!content) return;
        const mentionRegex = new RegExp(`^<@!?${client.user.id}> `);
        let prefix = content.match(mentionRegex) ? content.match(mentionRegex)[0] : client.prefix.get(guild.id) || config.prefix;
        if (!prefix) prefix = config.prefix;
        if (!content.toLowerCase().startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        message.text = message.content.slice(prefix.length).replace(args[0], "").trim();
        const commandName = args.shift().toLowerCase();
        const cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!cmd) return;

        let options = {
            name: cmd.name,
            description: cmd.description || "No Description",
            usage: cmd.usage || "Not Usage",
            enabled: cmd.enabled || true,
            aliases: cmd.aliases || [],
            category: cmd.category || "Unknown",
            botPermissions: cmd.botPermissions || [],
            memberPermissions: cmd.memberPermissions || [],
            ownerOnly: cmd.ownerOnly || false,
            cooldown: cmd.cooldown || 0,
            execute: cmd.execute
        }

        if (config.devConfig.enabled) return;

        if (!guild.me.permissionsIn(channel).has("SEND_MESSAGES")) return author.send(instance.embed("I don't have permission to send messages in that channel.", "error"))
        if (!guild.me.hasPermission("EMBED_LINKS")) return;
        if (!guild.me.permissionsIn(channel).has("EMBED_LINKS")) return;
        if (!options.enabled) return instance.send(message, instance.embed("This command has been disabled.", "error"), "embed")
        if (options.ownerOnly && !config.devConfig.owners.includes(author.id)) return instance.send(message, instance.embed("Only the bot owners can use this command.", "error"), "embed")

        const cooldownEntries = [...cooldown];
        const checkCooldown = cooldownEntries.find(x => x.id == author.id && x.command == options.name);
        if (checkCooldown) return instance.send(message, instance.embed(`You are on a cooldown, Please wait for **${prettyMS(Math.abs(new Date() - new Date(checkCooldown ? checkCooldown.timeOver : new Date())))}**.`, "error"), "embed");
        const newCooldown = {
            id: author.id,
            command: options.name,
            timeOn: new Date().toISOString(),
            timeOver: moment().add(options.cooldown, 'seconds').toISOString()
        }
        if (options.cooldown !== 0) {
            cooldown.add(newCooldown);
            setTimeout(() => {
                cooldown.delete(newCooldown)
            }, options.cooldown * 1000);
        }

        const requiredPermBot = options.botPermissions.map(p => {
            return {
                name: p,
                display: `${guild.me.hasPermission(p) ? `${config.static.emojis.success}` : `${config.static.emojis.error}`} ${p}`,
                raw: `**−** ${p}`,
                missing: guild.me.hasPermission(p)
            }
        });
        if (requiredPermBot.map(x => x.missing).includes(false)) return instance.send(message, instance.embed(`I require the following perms for this command:\n${requiredPermBot.filter(x => !x.missing).map(x => x.raw).join("\n")}`, "error"));

        const requiredPermMember = options.memberPermissions.map(p => {
            return {
                name: p,
                display: `${member.hasPermission(p) ? `${config.static.emojis.success}` : `${config.static.emojis.error}`} ${p}`,
                raw: `**−** ${p}`,
                missing: member.hasPermission(p)
            }
        });
        if (requiredPermMember.map(x => x.missing).includes(false)) return instance.send(message, instance.embed(`You require the following perms in order to use this command:\n${requiredPermMember.filter(x => !x.missing).map(x => x.raw).join("\n")}`, "error"));

        instance.command = {
            ...options,
            prefix: prefix,
            isEdited: false
        }

        cmd.execute(client, message, args, instance);
    })
}