const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "goeval",
    category: "Utilities",
    description: "Sanitized public eval command, evaluates golang code.",
    cooldon: 10,
    usage: "<code>",
    aliases: ['goevaluate', "go-eval", "go-eval", "golangeval", "golang-eval"],
    execute: execute
}

async function execute(client, message, args, instance) {
    if (!args[0]) return instance.send(message, instance.embed("Please re-run the command along with the code to evaluate!", 'error'), "embed");
    const msg = await instance.send(message, instance.embed("Contacting remote server, please wait.", "loading"), "embed");

    const startTime = Date.now();
    const evaluated = await goEval(message.text);
    if (!evaluated.status) return msg.edit(instance.embed("External server error, please try again later.", 'error'));

    let status = true;
    if (evaluated.Errors !== "") status = false;

    const embed = new MessageEmbed()
        .setAuthor("Evaluate Golang Code", status ? "https://iili.io/BxVFZF.png" : "https://iili.io/BxV3j1.png")
        .setColor(status ? instance.config.static.color.success : instance.config.static.color.error)
        .setDescription(`\`\`\`go\n${status ? evaluated.Events.map((e, i) => `#${++i}) ${e.Message}`).join("\n") : evaluated.Errors}\n\`\`\``)
        .setFooter(`Time Taken − ${Math.abs(Date.now() - startTime)} ms`, message.author.displayAvatarURL({ dynamic: true }))
    msg.edit(embed);
}

async function goEval(content) {
    try {
        const res = await fetch(`https://play.golang.org/compile`, {
            method: "POST",
            body: JSON.stringify({
                v: 2,
                body: content
            })
        }).then(r => r.json());
        return { status: true, ...res }
    } catch (e) {
        return { status: false }
    }
}