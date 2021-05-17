const { MessageAttachment } = require("discord.js");
const moment = require("moment");
const fetch = require("node-fetch");
const qs = require("querystring");

const { get: sourcebin } = require("sourcebin");
const hastebinClient = require("hastebin.js");
const { get: hastebin } = new hastebinClient();
const { Octokit } = require("@octokit/rest");
const { gists: githubgist } = new Octokit();

const bins = [
    {
        "name": "sourcebin",
        "url": "https://sourceb.in"
    },
    {
        "name": "hastebin",
        "url": "https://hastebin.com"
    },
    {
        "name": "gist",
        "url": "https://gist.github.com"
    },
    {
        "name": "srcshare",
        "url": "https://srcshare.io"
    }
]

module.exports = {
    name: "unbin",
    category: "Utility",
    description: `Extracts code from a source sharing website and sends it to discord.`,
    botPermissions: ["ATTACH_FILES"],
    usage: "<url>",
    cooldown : 30,
    execute: execute
}

async function execute(client, message, args, instance) {
    if (!args[0]) return instance.send(message, instance.embed(`Please provide a source code sharing website url. Supports: ${bins.map(b => `[${b.name}](${b.url})`).join(", ")}.`, "error"), "embed")
    const bin = await findAndRun(message.text);
    if (!bin.status) return instance.send(message, instance.embed(`Un-supported code sharing website url. Supports: ${bins.map(b => `[${b.name}](${b.url})`).join(", ")}.`, "error"), "embed")
    bin.data.forEach(b => {
        message.channel.send(...b)
    });
}

async function sourceBin(url) {
    try {
        const res = await sourcebin(url, { fetchContent: true });
        const content = `**Creation Date:** ${moment(res.created).format("dddd, MMMM Do YYYY, h:mm:ss a")}`;
        const file = new MessageAttachment(Buffer.from(res.files[0].content, "utf8"), "bin.txt");

        return { status: true, data: [[content, file]] }
    } catch (e) {
        return { status: false }
    }
}

async function hasteBin(url) {
    try {
        const res = hastebin(url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").trim().split("/")[1]);
        const file = new MessageAttachment(Buffer.from(res, "utf8"), "bin.txt");

        return { status: true, data: [[file]] }
    } catch (e) {
        return { status: false }
    }
}

async function srcShare(url) {
    try {
        const BASE_URL = "https://api.srcshare.io/code?id=";
        let key = qs.decode(url)
        if (Object.keys(key).length === 0) return { status: false };
        key = key[Object.keys(key)[0]];

        const res = await fetch(`${BASE_URL}${key}`).then(r => r.json());
        if (res.views === undefined) return { status: false };

        let data = [];
        if (res.code !== "") {
            const file = new MessageAttachment(Buffer.from(decodeURIComponent(res.code), "utf8"), "bin.txt");
            data.push(["**Code**:", file])
        }
        if (res.error !== "") {
            const file = new MessageAttachment(Buffer.from(decodeURIComponent(res.error), "utf8"), "bin.txt");
            data.push(["**Error**:", file])
        }
        return { status: true, data }
    } catch (e) {
        return { status: false }
    }
}

async function githubGist(url) {
    try {
        const gistId = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").replace("gist.github.com/", "").split("/").reverse()[0].trim();
        const res = await githubgist.get({
            gist_id: gistId
        });

        if (!res.data.files) return { status: false };
        const content = `**Creation Date:** ${moment(res.data.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a")}`;
        const file = new MessageAttachment(Buffer.from(decodeURIComponent(res.data.files[Object.keys(res.data.files)[0]].content), "utf8"), "bin.txt");
        return { status: true, data: [[content, file]] }
    } catch (e) {
        return { status: false }
    }
}

function findAndRun(text) {
    if (text.startsWith("https://hastebin.com")) return hasteBin(text);
    if (text.startsWith("https://sourceb.in")) return sourceBin(text);
    if (text.startsWith("https://srcshare.io")) return srcShare(text);
    if (text.startsWith("https://gist.github.com")) return githubGist(text);
    return { status: false }
}