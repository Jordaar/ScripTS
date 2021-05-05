const { Client, Message, MessageEmbed } = require("discord.js");
const npmSearch = require('libnpmsearch');
const moment = require("moment");
const fetch = require("node-fetch");
const chartJS = require("chartjs-to-image");

module.exports = {
    name: "npm",
    category: "Search",
    description: "Search for [npm](https://www.npmjs.com) packages.",
    usage: "<packageName>",
    cooldown: 10,
    execute
}

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array} args 
 * @param {String} text 
 * @param {*} instance 
 */

async function execute(client, message, args, text, instance) {
    const { guild, channel, author, member } = message;
    if (!args[0]) return instance.send(message, instance.embed("Please provide a package name to search.", "error"), "embed")
    const search = await npmSearch(text);
    if (search.length == 0) return instance.send(message, instance.embed(`Unable to find a package with the name "${text}"`, "error"), "embed")
    const package = search[0];

    const embed = new MessageEmbed()
        .setAuthor("NPM", "https://i.imgur.com/ErKf5Y0.png", "https://www.npmjs.com")
        .setTitle(package.name)
        .setURL(`https://www.npmjs.com/package/${package.name}`)
        .setDescription(package.description || "No Discription")
        .addField("Version", package.version, true)
        .addField("Author", package.author ? `${package.author.name || "Unknown"}` : "Unknown", true)
        .addField("Modification Date", moment(package.date ? package.date : new Date().toISOString()).format("DD/MM/YYYY"), true)
        .addField("Maintainers", package.maintainers ? package.maintainers.map(m => m.username).join(", ") : "None")
        .setColor("#CB0000");

    const chart = await createChart(package);
    if (chart) embed.setImage(chart);

    instance.send(message, embed, "embed")
}

async function createChart(packageData) {
    try {
        const startDate = moment().subtract("1", "year");
        let data = await fetch(`https://npm-stat.com/api/download-counts?package=${packageData.name}&from=${startDate.format("YYYY-MM-DD")}&until=${moment().format("YYYY-MM-DD")}`)
        data = await data.json();
        let arrayData = Object.entries(data[packageData.name]);

        const chart = new chartJS()
            .setConfig({
                type: "line",
                data: {
                    labels: arrayData.map((x, i) => i),
                    datasets: [
                        {
                            data: arrayData.map(x => x[1]),
                            backgroundColor: "#171717",
                            fill: true,
                            borderWidth: 2,
                            borderColor: "#F04947",
                            pointRadius: 0,
                            lineTension: 0.2
                        }
                    ],
                },
                options: {
                    title: {
                        display: true,
                        text: `${packageData.name} | Download Stats`,
                        fontColor: "#F04947"
                    },
                    legend: {
                        display: false,
                    },
                    scales: {
                        xAxes: [{
                            display: false
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: false
                            }
                        }]
                    }
                }
            })
            .setBackgroundColor("#1E1E1E");
        const chartUrl = await chart.getShortUrl();
        return chartUrl;
    } catch (e) {
        console.log(e);
        return false;
    }
}