const mongoose = require("mongoose");
const config = require("../../../config");

const guildSchema = new mongoose.Schema({
    guildId: {
        type: Number,
        required: true
    },
    prefix: {
        type: String,
        required: false,
        default: config.prefix
    },
    commandsRun: {
        type: Number,
        required: false,
        default: 0
    },
    lastUpdated: {
        type: String,
        required: false,
        default: new Date().toISOString()
    }
});

module.exports = mongoose.model('guildConfig', guildSchema);