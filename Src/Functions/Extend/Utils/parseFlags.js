const REGEX = /--\w+/gm;
/**
 * 
 * @param {String} text 
 * * @param {Boolean} bool 
 */

function parseFlags(text) {
    let output = {
        flags: [],
        rawText: text,
        sanitizedText: ""
    };

    text.split(" ").forEach((str) => {
        if (str.startsWith("--") && str.match(REGEX)) {
            if (str.includes("=")) return output.flags.push({
                key: str.split("=")[0].replace("--", ""),
                value: str.split("=")[1],
                raw: str
            });
            output.flags.push({
                key: str.replace("--", ""),
                value: str.replace("--", ""),
                raw: str
            })
        }
    });

    output.sanitizedText = sanitizeText(text, output.flags);

    output.get = function (key) {
        const find = output.flags.find(f => f.key.toLowerCase() == key);
        if (find) return find.value;
        return undefined;
    }

    return output;
}
module.exports = parseFlags;

function sanitizeText(txt, flags) {
    flags.forEach((flag) => {
        txt = txt.replace(flag.raw, "")
    })
    return txt.trim();
}