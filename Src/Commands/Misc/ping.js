module.exports = {
    name: "ping",
    category: "Misc",
    description: "Shows the latency of the bot.",
    execute: execute
}

async function execute(client, message, args, text, instance) {
    const msg = await instance.send(message, "Pong!", "string");
    const ping = msg.createdTimestamp - message.createdTimestamp;
    await msg.edit(`Pong! \`${Math.abs(ping)}ms\``)
}