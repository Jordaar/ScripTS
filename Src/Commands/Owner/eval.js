module.exports = {
    name: "eval",
    category: "Owner",
    ownerOnly: true,
    description: "Evaluates code, owner only.",
    execute: execute
}

async function execute(client, message, args, instance) {
    if (!args[0]) return;

    let msg = message,
        arguments = args,
        { channel, guild, author, member } = message
    try {
        var code = message.text;
        if (code.match('process.env')) return;
        var evaled = eval(code);

        if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
        message.channel.send(evaled, { split: true, code: "js" })
    } catch (err) {
        message.channel.send(err, { split: true, code: "js" })
    }
}