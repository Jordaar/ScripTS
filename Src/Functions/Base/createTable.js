const { createStream } = require("table");
const { Collection } = require("discord.js");
const chalk = require("chalk");
const config = require("./tableConfig");

/**
 * 
 * @param {Collection} cmds 
 */

function createTable(cmds) {
    const stream = createStream(config);

    for (let i = 0; i < cmds.array().length; i++) {
        const cmd = cmds.array()[i];
        let check = [];
        if(!cmd.name)check.push(false)
        if(!cmd.execute)check.push(false)

        stream.write([cmd.name || 'Undefined' , check.includes(false) ? chalk.whiteBright.bgRed('Error') : chalk.whiteBright.bgGreen('Success')])
    }
}

module.exports = createTable;