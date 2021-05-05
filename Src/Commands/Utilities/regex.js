const { MessageEmbed } = require('discord.js');
const getResponse = require('../../Functions/Base/getResponse');
const parse = require('regex-parser')

module.exports = {
    name: "regex",
    category: "Utilities",
    description: "Tests Regex",
    cooldon: 5,
    execute: execute
}

async function execute(client, message, args, text, instance) {
    const regexMsg = await getResponse(message,"Please enter the regular expression",60000,true,true).then(m => m.delete());
    let regex;
    try{
        regex = parse(regexMsg.content);
    } catch (e) {
        return instance.send(message,instance.embed(`There was an error in the RegEx\nError: ${e}`,'error'),"string");
    }
    const strMsg = await getResponse(message,"Please enter the test string",60000,true,true).then(m => m.delete());
    const str = strMsg.content;

    let matches = regex.global ? [...str.matchAll(regex)] :str.match(regex);

    instance.send(message,
        new MessageEmbed()
        .setColor('BLUE')
        .setTitle("Regex Utility")
        .addField('Regex',`\`\`\`${regex}\`\`\``)
        .addField('Test String',`\`\`\`${str}\`\`\``)
        .addField('Matches Found', "```" + (matches ? matches.map((m,index) => {
            if(typeof m == 'object') return `(#${index+1}) Match -> ${m.shift()}` + (m.length > 0 ? (`\n     Capturing Groups -> ` + m.join(', ')) : '') + '\n';
            return `(#${index+1}) ${m}`;
        }).join('\n') : "none") + "```")
        ,'embed')
}