require("dotenv").config();
const config = require("./config"),
    DiscordJS = require("discord.js"),
    mongoose = require("mongoose"),
    getFiles = require("./Src/Functions/Base/getFiles"),
    chalk = require("chalk"),
    createTable = require("./Src/Functions/Base/createTable"),
    loadFunctions = require("./Src/Functions/index");

const client = new DiscordJS.Client({
    partials: ['CHANNEL', 'MESSAGE', 'REACTION', 'GUILD_MEMBER', 'USER']
});

client.prefix = new DiscordJS.Collection();
client.commands = new DiscordJS.Collection();
client.events = 0;
client.exeCmd = new DiscordJS.Collection();

async function load() {

    client.on("ready", () => {
        console.log(chalk.green("API > Connected"))

        client.user.setPresence(config.status)

        const functions = loadFunctions(client);
        if (functions) {
            console.log(chalk.magenta(`Process > Loaded All Functions`))
        }

        const features = getFiles(config.eventsDir);
        client.events = features.length;
        console.log(chalk.cyan(`CommandHandler > Loaded ${features.length} Features`))
        features.forEach((files) => {
            const event = require(files[0]);
            event(client, config);
        });

        const commands = getFiles(config.commandsDir);
        console.log(chalk.cyan(`CommandHandler > Loaded ${commands.length} Commands`))
        commands.forEach((cmd) => {
            const command = require(cmd[0]);
            client.commands.set(command.name, command);
        });
    })
        .on("disconnect", () => console.log(chalk.hex('#FF8800')("API > Disconnecting")))
        .on("reconnecting", () => console.log(chalk.yellow("API > Reconnecting")))
        .on("error", (e) => console.log(e))
        .on("warn", (info) => console.log(info))

    mongoose.connect(config.mongoDB, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).then(() => {
        console.log(chalk.yellow("MongoDB > Connected"));
    }).catch((err) => {
        console.log(chalk.red("MongoDB > Error" + "\n" + err));
    });
}

load();

if (config.devConfig.debug) {
    createTable(client.commands)
}

client.login(config.token)
exports.Client = client;