const { MessageEmbed } = require("discord.js");

const usage = new MessageEmbed()
        .setTitle("Hey!, Welcome to the usage page.")
        .setDescription(">>> Here you will come to know what `<>` , `[]` , `|` and `...` means!")
        .addField("<argument>", " This means that the argument is **__required__**.")
        .addField("[argument]", "This means that the argument is **__optional__**.")
        .addField("a | b", "This is usually chained with <> or []. Example: <a | b>\nThis means either **__a__** or **__b__**.")
        .addField("...", "This is also chained with <> or []. Example: [argument...]\nThis means that you can have **multiple** arguments.")
        .addField("\u200B", "> ⚠ **Note: Do not type in the brackets**.\n> ❓ **Still confused?** Join our [Support Server](https://discord.gg/fd44xNFnxS).")
        .setFooter("Usage Page")

module.exports = usage;