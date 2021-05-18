const { MessageEmbed } = require('discord.js');
const { fork } = require('child_process');
const path = require('path');

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

const mathEvaluate = (expression) => {
    return new Promise(async (resolve,reject) => {
        const compute = fork(
            path.join(__dirname,'..','..','Functions','Extend','Utils','mathChild.js'),
            [],
            {
                timeout: 10000,
                stdio: 'ignore'
            }
            );
        compute.send(expression);

        compute.on('error', reject);
        compute.on('close', reject);

        compute.on('message', resolve);
    });
}

module.exports = {
    name: "math",
    category: "Utilities",
    description: "Evaluate mathematical expressions and equations.",
    cooldown: 10,
    usage: "<mathematical-expressions>",
    aliases: ['mathevaluate', "math-eval", "maths"],
    execute: execute
}

async function execute(client, message, args, instance) {
    if (!args[0]) return instance.send(message, instance.embed("Please re-run the command along with the mathematical expressions to evaluate!", 'error'), "embed")

    const startTime = Date.now();
    let output;
    let status = true;

    try {
        const input = message.text;
        let evaled = await mathEvaluate(input);
        if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
        output = evaled;
    } catch (err) {
        status = false;
        output = "There was an error while evaluating that expression!\nPlease check your expression!"; //`There was an error while evaluating that expression!\nError: ${err}`
    }

    const endTime = Date.now();
    let chunks = chunk(output.split(''));

    let embeds = chunks.map((text, index) => {
        text = text.join("");
        return new MessageEmbed()
        .setAuthor("Evaluate Mathematical Expressions", status ? "https://iili.io/BxVFZF.png" : "https://iili.io/BxV3j1.png")
        .setColor(status ? instance.config.static.color.success : instance.config.static.color.error)
        .setDescription(`\`\`\`${text}\`\`\``)
        .setFooter(`Time Taken − ${Math.abs(endTime - startTime)} ms`, message.author.displayAvatarURL({ dynamic: true }));
    })

    return embeds.length > 1 ? instance.paginate(message, embeds) : instance.send(message, embeds[0], 'embed');
}
