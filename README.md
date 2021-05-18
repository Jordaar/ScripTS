# ScripTS Bot
This is a bot was made for [Worn Off Keys](https://wornoffkeys.com/discord) programming competition, based on programmin theme.

This Bot is open sourced under the MIT License.

# ScripTS API

**Base Url** - https://api.scripts-bot.cf

**Important Note** - While the api is and always will public, please don't abuse it.


|    Routes    | Query String Params| Description   | Preview |
|--|--|--|--|
| /npm | `package` - Name of the npm package. | Generates download stats chart of a npm package. | [Click Here](https://api.scripts-bot.cf/npm?package=axios) |
|/github-repo | `repo` - The github repository name.<br/>`username` - The owner of the repository.<br/>`....` - [other options](https://github.com/anuraghazra/github-readme-stats#common-options). | Generates a beautiful github repo card. | [Click Here](https://api.scripts-bot.cf/github-repo?username=discordjs&repo=discord.js)
|/github-contribution | `user` - The github user login name.<br/>`theme` - (optional) [themes](https://github.com/sallar/github-contributions-canvas#available-themes). | Generates github user contribution image. | [Click Here](https://api.scripts-bot.cf/github-contribution?user=Jordaar)
| /github-contribution/graph | `user` - The github user login name.<br/>`theme` - (optional) react or dark. | Generates a line graph of the user's contributions. | [Click Here](https://api.scripts-bot.cf/github-contribution/graph?user=Jordaar)
| /code-snippet | `code` - A code snippet string. | Generates an image, useful for sharing code snipppets. | [Click Here](https://api.scripts-bot.cf/code-snippet?code=console.log(%22Hello%20World%22))


## Author

**ScripTS Bot** © [ScripTS](https://github.com/Jordaar/ScripTS/graphs/contributors).  
Authored and maintained by Jordaar & contributors.

> GitHub [@Jordaar](https://github.com/Jordaar)