const axios = require("axios");

module.exports = {
    name: "vote",
    category: "Misc",
    description: "Used to vote the bot in [worn off keys](https://wornoffkeys.com/discord) competition.",
    execute: execute
}

async function execute(client, message, args, instance) {
    const userId = message.author.id;
    const teamId = "ScripTS";

    const url = `https://wornoffkeys.com/api/competition/voting?userId=${userId}&teamId=${teamId}`;

    const newMessage = await message.channel.send(instance.embed("Voting, please wait...", "loading"));

    axios
        .post(url)
        .then(({ data }) => {
            if (data.success) {
                newMessage.edit(instance.embed(data.message, "success"));
            }
        })
        .catch((err) => {
            if (err.response.data) {
                const { message: text } = err.response.data;
                console.error(text);
                newMessage.edit(instance.embed(text, "error"));
                return;
            }

            console.error(err);
        });
}