module.exports = async (message, question, limit = 60000, obj = false, del = false) => {
    const filter = m => m.author.id === message.author.id;
    let req = await message.channel.send(question);
    try {
        const collected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
        if(del) req.delete();
        if (obj) return collected.first();
        return collected.first().content;
    } catch (e) {
        return false;
    }
}