const { MessageEmbed } = require("discord.js");

const info = new MessageEmbed()
    .setTitle("Hello, Welcome to the help page.")
    .addField("What does these reactions mean?", "⏮️ \`->\` Goes to the first page\n◀ \`->\` Goes to the previous page\n▶ \`->\` Goes to the next page\n⏭️ \`->\` Goes to the last page\n↗ \`->\` Lets you to type a page number to go to\n⏹️ \`->\` Stops the session i.e., deletes the embed\nℹ \`->\` Shows what these reactions mean(this message)") //->\` Shows the syntax(correct usage of the bot)
    .setFooter("Help Page");
    
module.exports = info;