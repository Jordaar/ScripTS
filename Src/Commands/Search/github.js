const { MessageEmbed, Collection } = require("discord.js");
const fetch = require("node-fetch");
const { Octokit } = require("@octokit/rest");
const github = new Octokit();
const moment = require("moment");;

const flags = [
    "--user",
    "--org",
    "--repo",
    "--topic"
]

module.exports = {
    name: "github",
    aliases: ["git"],
    category: "Search",
    description: "Searches [Github](https://github.com/about).",
    usage: `<query> [${flags.join(" | ")}]`,
    cooldown: 10,
    execute
}

const cache = new Collection();
async function execute(client, message, args, instance) {
    if (!args[0]) return instance.send(message, instance.embed("Please provide a query to search.", "error"), "embed")
    const { sanitizedText } = instance.parseFlags(message.text);
    if (!sanitizedText) return instance.send(message, instance.embed("Please provide a query to search.", "error"), "embed")
    let res = { status: false }

    if (cache.has(message.text.toLowerCase())) {
        res = cache.get(message.text.toLowerCase());
        setTimeout(() => {
            cache.delete(message.text.toLowerCase())
        }, 1000 * 5);
    }
    else {
        res = await searchGithub(message.text);
        cache.set(message.text.toLowerCase(), res);
    }
    if (!res.status) return instance.send(message, instance.embed(`Unable to find any results for the given query, use flags to search for a specific type: [${flags.join(" | ")}]`, "error"), "embed")

    let embed = new MessageEmbed().setColor("#23272A");
    const GITHUB_ICON = "https://iili.io/BAgzfs.png";
    const GITHUB_URL = "https://github.com/about";

    switch (res.trigger) {
        case "repo":
            if (res.items.length == 0) return instance.send(message, instance.embed("Unable to find any repository with that name.", "error"), "embed")
            res.target = res.items[0];

            embed.setAuthor("Github Repository", GITHUB_ICON, GITHUB_URL)
                .setTitle(res.target.name)
                .setURL(res.target.html_url)
                .setDescription(res.target.description || "No Description Given")
                .addField("Owner", `[${res.target.owner.login}](${res.target.owner.html_url}) \`(${res.target.owner.type})\``, true)
                .addField("Creation Date", moment(res.target.created_at).format("DD/MM/YYYY"), true)
                .addField("Last Updated", moment(res.target.updated_at).format("DD/MM/YYYY") + `\n\`${moment(res.target.updated_at).toNow(true)} ago\``, true)
                .addField("Default Branch", `[${res.target.default_branch}](https://github.com/Jordaar/ScripTS/tree/${res.target.default_branch})`, true)
                .addField("Stars Count", `${res.target.stargazers_count} stars`, true)
                .addField("Open Issues", `${res.target.open_issues} issues`, true)
                .addField("Forks Count", `${res.target.forks_count} forks`, true)
                .addField("License", res.target.license ? `[${res.target.license.name}](${res.target.license.url})` : "No License", true)
                .setImage(`${instance.config.apiUrl}/github-repo?username=${res.target.owner.login}&repo=${res.target.name}&hide_border=true&theme=dark`);

            instance.send(message, embed, "embed")
            break;

        case "org":
            embed.setAuthor("Github Organization", GITHUB_ICON, GITHUB_URL)
                .setTitle(`${res.name ? res.name : res.login}`)
                .setURL(res.html_url)
                .setDescription(`${res.is_verified ? instance.config.static.emojis.success : ""} ${res.description || "No Description"}`)
                .setThumbnail(res.avatar_url)
                .addField("Creation Date", moment(res.created_at).format("DD/MM/YYYY"), true)
                .addField("Last Updated", moment(res.updated_at).format("DD/MM/YYYY"), true)
                .addField("Website", res.blog || "No Website", true)
                .addField("Location", res.location || "Unknown", true)
                .addField("Public Repositories", `${res.public_repos} repos`, true)
                .addField("Public Gists", `${res.public_gists} gists`, true)
                .addField("Members", `${res.allMembers.map(m => `[${m.login}](${m.html_url})`).slice(0, 20).join(", ")} ${20 < res.allMembers.length ? `[...](https://github.com/orgs/${res.login}/people)` : "."}`, false);

            instance.send(message, embed, "embed")
            break;

        case "topic":
            if (res.items.length == 0) return instance.send(message, instance.embed("Unable to find any topics with that name.", "error"), "embed")

            let embeds = [];
            res.items.forEach((itm) => {
                const topicEmbed = new MessageEmbed()
                    .setColor("#23272A")
                    .setAuthor("Github Topic", GITHUB_ICON, GITHUB_URL)
                    .setTitle(itm.display_name || itm.name)
                    .setURL(`https://github.com/topics/${itm.name}`)
                    .setDescription(itm.description || itm.short_description || "No Description Given")
                    .addField("Created By", itm.created_by || "Unknown", true)
                    .addField("Released On", itm.released ? itm.released : moment(itm.created_at).format("MMMM DD, YYYY"), true)
                    .addField("Last Updated", moment(itm.updated_at).format("DD/MM/YYYY"), true);
                embeds.push(topicEmbed)
            });

            instance.paginate(message, embeds);
            break;

        case "user":

            embed.setAuthor("Github User", GITHUB_ICON, GITHUB_URL)
                .setTitle(`${res.name ? res.name : res.login}`)
                .setURL(res.html_url)
                .setThumbnail(res.avatar_url)
                .addField("Creation Date", moment(res.created_at).format("DD/MM/YYYY"), true)
                .addField("Last Updated", moment(res.updated_at).format("DD/MM/YYYY"), true)
                .addField("Website", res.blog || "No Website", true)
                .addField("Location", res.location || "Unknown", true)
                .addField("Followers", res.followers || "None" == 0 ? "No followers" : `${res.followers} followers`, true)
                .addField("Following", `${res.following || "0"} users`, true)
                .addField("Public Repositories", `${res.public_repos || "0"} repos`, true)
                .addField("Public Gists", `${res.public_gists || "0"} gists`, true);

            const repos = await fetch(res.repos_url).then(res => res.json());
            embed.addField("Repositories", `${repos.map(r => `[${r.name}](${r.html_url})`).slice(0, 10).join(", ")} ${10 < repos.length ? `[...](https://github.com/${res.login}?tab=repositories)` : "."}`)

            if (res.type == "User") embed.setImage(`${instance.config.apiUrl}/github-contribution/graph?user=${encodeURIComponent(res.login)}`)

            instance.send(message, embed, "embed");
            break;

        default:
            instance.send(message, instance.send(`Unable to search github, kindly use flags to narrow down the search result.\n, use flags to search for a specific type.\n[${flags.join(" | ")}]`, "error"), "embed");
            break;
    }

    async function searchGithub(text) {
        const { sanitizedText, get } = instance.parseFlags(text);

        try {
            if (get("repo") || get("repository")) {
                const fetched = await github.rest.search.repos({
                    q: encodeURI(sanitizedText)
                });
                return { status: fetched.status == 200 ? true : false, trigger: "repo", ...fetched.data }
            }

            if (get("org") || get("organization")) {
                const fetched = await github.rest.orgs.get({
                    org: encodeURI(sanitizedText)
                });
                const members = await github.rest.orgs.listMembers({
                    org: encodeURI(sanitizedText)
                })
                return { status: fetched.status == 200 ? true : false, trigger: "org", ...fetched.data, allMembers: members.data }
            }

            if (get("topic" || get("topics"))) {
                const fetched = await github.rest.search.topics({
                    q: encodeURI(sanitizedText)
                });
                return { status: fetched.status == 200 ? true : false, trigger: "topic", ...fetched.data }
            }

            if (get("user")) {
                const fetched = await github.rest.users.getByUsername({
                    username: encodeURI(sanitizedText)
                });
                return { status: fetched.status == 200 ? true : false, trigger: "user", ...fetched.data }
            }

            const fetched = await github.rest.users.getByUsername({
                username: encodeURI(sanitizedText)
            });
            return { status: fetched.status == 200 ? true : false, trigger: "user", ...fetched.data }
        } catch (e) {
            return { status: false }
        }
    }
}