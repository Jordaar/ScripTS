const { MessageEmbed } = require('discord.js');
const safeEval = require('notevil');
const clean = text => ((typeof text === "string") ? text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)) : text);

const chunk = (array, chunkSize = 2000) => {
    if (!Array.isArray(array)) return array;
    return array.reduce((previous, current) => {
        let chunk;
        if (!previous.length || previous[previous.length - 1].length === chunkSize) {
            chunk = [];
            previous.push(chunk);
        } else chunk = previous[previous.length - 1];
        chunk.push(current);
        return previous;
    }, []);
}

module.exports = {
    name: "jseval",
    category: "Utilities",
    description: "Sanitized public eval command, evaluates javascript code.",
    cooldon: 10,
    usage: "<code>",
    aliases: ['jsevaluate', "js-eval", "javascript-eval"],
    execute: execute
}

async function execute(client, message, args, instance) {
    if (!args[0]) return instance.send(message, instance.embed("Please re-run the command along with the code to evaluate!", 'error'), "embed")

    const startTime = Date.now();
    let output;
    let status = true;
    let logs = [];

    const psuedoConsole = {
        log: (t) => { logs.push(t); return; },
        error: (t) => { logs.push(t); return; },
        warn: (t) => { logs.push(t); return; },
    };

    try {
        const code = text;
        let evaled = safeEval(code, { console: psuedoConsole });
        if (evaled instanceof Promise) evaled = await evaled;
        else if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
        evaled = clean(evaled);
        if (!evaled || evaled == 'undefined') evaled = logs.map(p => typeof p !== "string" ? require("util").inspect(p) : p).join('\n');
        output = evaled;
    } catch (err) {
        status = false;
        output = err.toString();
    }

    const endTime = Date.now();
    let chunks = chunk(output.split(''));

    let embeds = chunks.map((text, index) => {
        text = message.content.split(" ").slice(1).join(" ");
        return new MessageEmbed()
            .setAuthor("Evaluate JavaScript Code", status ? "https://iili.io/BxVFZF.png" : "https://iili.io/BxV3j1.png")
            .setColor(status ? instance.config.static.color.success : instance.config.static.color.error)
            .setDescription(`\`\`\`js\n${text}\n\`\`\``)
            .setFooter(`Time Taken − ${Math.abs(endTime - startTime)} ms`, message.author.displayAvatarURL({ dynamic: true }))
    })

    return embeds.length > 1 ? instance.paginate(message, embeds) : instance.send(message, embeds[0], 'embed');
}