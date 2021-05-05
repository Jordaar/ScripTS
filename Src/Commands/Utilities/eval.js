const { MessageEmbed } = require('discord.js');
const safeEval = require('safe-eval');
const clean = text => ((typeof text === "string") ? text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)) : text);

module.exports = {
    name: "eval",
    category: "Utilities",
    description: "Sanitized public eval command... Evaluates javascript code",
    cooldon: 10,
    usage: "<code>",
    execute: execute
}

async function execute(client, message, args, text, instance) {
    if(args.length < 0) instance.send(message,instance.embed("Please re-run the command along with the code to evaluate!"),"string")

    let output;
    let status = true;

    try{
        const code = args.join(' ');
        let evaled = safeEval(code);

        if (evaled instanceof Promise) evaled = await evaled;
        else if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

        output = clean(evaled);

    } catch (err) {
        status = false;
        output = err.toString();
    }

    return instance.send(message,new MessageEmbed({
        color: status ? 'GREEN' : 'RED',
        title: "Evaluated code",
        description: `\`\`\`js\n${output}\`\`\``
    }),"embed")
    
}