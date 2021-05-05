const prompt = require("discordjs-prompter");

module.exports = async (message, question, options) => {
    const messagePrompt = await prompt.message(message.channel, {
        question: question,
        userId: options ? options.userId : message.author.id,
        max: options ? options.max : 1,
        timeout: options ? options.timeout : 30 * 1000,
    });
    return messagePrompt;
}