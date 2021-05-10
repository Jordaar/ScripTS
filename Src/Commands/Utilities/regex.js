const { MessageEmbed, Collector } = require('discord.js');
const parseRegex = require('regex-parser');

module.exports = {
    name: "regex",
    category: "Utilities",
    description: "Used to test regular expressions.",
    cooldon: 5,
    execute: execute
}

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array} args 
 * @param {String} text 
 * @param {*} instance 
 */

async function execute(client, message, args, instance) {
    const response = await instance.prompt(message, instance.embed("Please provide a regular expression.", "loading")).catch(_ => { });
    let regex;
    try {
        regex = parseRegex(response.first().content);
        if (response.first().deletable) response.first().delete();
    } catch (e) {
        regex = null;
        return instance.send(message, instance.embed(`There is a problem with the regular expression.`, 'error').addField("Problem", `\`\`\`js\n${e || "Unknown"}\n\`\`\``), "embed");
    }
    if (regex === null) return;

    const response2 = await instance.prompt(message, instance.embed("Please provide a string to evaluate the regular expression with.", "loading")).catch(_ => { });
    const str = response2.first().content;
    if (response2.first().deletable) response2.first().delete();
    const matches = regex.global ? [...str.matchAll(regex)] : str.match(regex);

    instance.send(message,
        new MessageEmbed()
            .setColor("#1AAF5D")
            .setAuthor("Regular Expression Tester", "https://iili.io/BxV9YQ.png", "https://regex101.com")
            .addField('Regular Expression', `\`\`\`${regex}\`\`\``, true)
            .addField('Provided String', `\`\`\`${str}\`\`\``, true)
            .addField('Matches Found', "```\n" + (matches ? matches.map((m, index) => {
                if (typeof m == 'object') return `(#${index + 1}) Match -> ${m.shift()}` + (m.length > 0 ? (`\n     Capturing Groups -> ` + m.join(', ')) : '') + '\n';
                return `(#${index + 1}) ${m}`;
            }).join('\n') : "No Matches") + "```", false)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
        , 'embed');
}