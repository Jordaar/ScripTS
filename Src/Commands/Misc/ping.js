module.exports = {
    name: "ping",
    category: "Misc",
    description: "Shows the latency of the bot.",
    execute: execute
}

async function execute(client, message, args, instance) {
    const time = Date.now();
    const msg = await instance.send(message, "Pong!", "string");
    const ping = Date.now() - time;
    await msg.edit(`Pong! \`${Math.abs(ping)}ms\``)
}