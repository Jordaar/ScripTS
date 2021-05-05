const { MessageEmbed } = require('discord.js');
const safeEval = require('notevil');
const clean = text => ((typeof text === "string") ? text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)) : text);
module.exports = {
    name: "eval",
    category: "Utilities",
    description: "Sanitized public eval command, evaluates javascript code.",
    cooldon: 10,
    usage: "<code>",
    aliases: ['evaluate'],
    execute: execute
}

async function execute(client, message, args, text, instance) {
    if (!args[0]) return instance.send(message, instance.embed("Please re-run the command along with the code to evaluate!",'error'), "embed")

    const startTime = Date.now();
    let output;
    let status = true;
    let logs = [];

    const console = {
        log: (t) => {logs.push(t); return;},
        error: (t) => {logs.push(t); return;},
        warn: (t) => {logs.push(t); return;},
    };

    try {
        const code = text;
        let evaled = safeEval(code,{console});
        if (evaled instanceof Promise) evaled = await evaled;
        else if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
        evaled = clean(evaled);
        if(!evaled || evaled == 'undefined') evaled = logs.map(p => typeof p !== "string" ? require("util").inspect(p) : p).join('\n');
        output = evaled;
    } catch (err) {
        status = false;
        output = err.toString();
    }
    const embed = new MessageEmbed()
        .setAuthor("Evaluate JS Code", status ? "https://iili.io/BxVFZF.png" : "https://iili.io/BxV3j1.png")
        .setColor(status ? instance.config.static.color.success : instance.config.static.color.error)
        .setDescription(`\`\`\`js\n${output}\n\`\`\``)
        .setFooter(`Time Taken − ${Math.abs(Date.now() - startTime)} ms`,message.author.avatarURL({dynamic: true}))
    instance.send(message, embed, "embed")
}