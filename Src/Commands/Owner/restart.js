module.exports = {
    name: "restart",
    aliases: ["rs"],
    category: "Owner",
    ownerOnly: true,
    description: "Used to restart the bot.",
    execute: execute
}

async function execute(client, message, args, instance) {
    await message.channel.send("👌");
    process.exit();
}