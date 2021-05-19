const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    guildId: {
        type: Number,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    createdOn: {
        type: String,
        required: false,
        default: new Date().toISOString()
    },
    uses: {
        type: Number,
        required: false,
        default: 0
    },
    response: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('tag', tagSchema);