const { Client, Message } = require("discord.js");

module.exports = {
    name: "example",
    category: "Category",
    description: "Command Description",
    usage: "Command Usage",
    enabled: true,               //Optional (default: true)
    botPermissions: [],          //Optional (default: ["SEND_MESSAGES" , "EMBED_LINKS"])
    memberPermissions: [],       //Optional (default: [])
    ownerOnly: false,            //Optional (default: false)
    cooldown: 0,                 //Optional (default: 0 [in seconds])
    execute: execute
}

// I like this format, makes the code look cleaner & intellisense helps a lot
// Also command files starting with "!" are ignored, like this one

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array} args 
 * @param {String} text 
 * @param {*} instance 
 */

async function execute(client, message, args, text, instance) {
    const { guild, channel, author, member } = message; //Please use destructuring, makes the code look clean

    channel.send("Test") // Without auto edit functionality
    instance.send() // With auto edit functionality

    /*
    message --> messageObject
    payload --> can be MessageEmbed or normal string(message)  
    type --> is the type of the payload
    example --> 
    instance.send("Hello World" , "string")
    instance.send(embed , "embed")

    returns messageObject of the edited message
    */
    instance.send(message, payload, type)

    /*
    text --> string (normal message)
    type --> is shows the type of embed
    example -->
    instance.embed("Success Embed" , "success")
    instance.embed("Error Embed" , "error")
    instance.embed("Info Embed" , "info")

    returns MessageEmbed
    */
    instance.embed(text, type)

    /*
    message --> messageObject
    embeds --> array of embeds

    returns paginationObject // refer www.npmjs.com/package/discord-paginationembed
    */
    instance.paginate(message, embeds)
}