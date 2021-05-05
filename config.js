module.exports = {
    token: process.env.TOKEN,
    prefix: "?",
    mongoDB: process.env.MONGO_DB,
    commandsDir: "./Src/Commands",
    eventsDir: "./Src/Events",
    devConfig: {
        enabled: false,
        owners: ["803491655515635763", "477649356191825920", "461756834353774592"],
        guild: '838824533036367872',
        debug: false
    },
    static: {
        emojis: {
            "success": "<:Success:839021779221086289>",
            "error": "<:Error:839021864033583144>",
            "info": "<:Info:839027748512989224>"
        },
        color: {
            "success": "#43B581",
            "error": "#F04947",
            "info": "#FFFFFF"
        }
    }
}