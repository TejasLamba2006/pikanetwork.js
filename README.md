![banner](https://i.ibb.co/3dChy9y/cooltext441822979190041.png)

## **An easy to use [PikaNetwork API](https://www.pika-network.net/threads/pikanetwork-api.290646/) wrapper.**

[![npm package][npm-img]][npm-url] [![Downloads][downloads-img]][downloads-url] [![Issues][issues-img]][issues-url]

## About

pikanetwork.js is a [NodeJS](https://nodejs.org) module which allows you to interact with the [PikaNework API](https://www.pika-network.net/threads/pikanetwork-api.290646/) easily.

- Written in JavaScript
- Frequently updated
- 100% coverage of PikaNetwork API

## Installation

**Node.js 14+ or newer is required**

```bash
npm install pikanetwork.js
yarn add pikanetwork.js
pnpm add pikanetwork.js
```

## Usage

### Profile

```js
const { Profile } = require("pikanetwork.js");

async function fetchProfile() {
  const playerIGN = "PikaNetwork";
  const profile = new Profile(playerIGN);

  try {
    const ranks = await profile.getRankInfo(); // Get information about the player's ranks.
    const levelling = await profile.getLevellingInfo(); // Get information about the player's network level and rank.
    const guild = await profile.getGuildInfo(); // Guild information about the player's guild.
    const friends = await profile.getFriendList(); // Get a list of friends the player has.
    const joinInfo = await profile.getJoinInfo(); // Get information about the player's estimated first join and last join.
    const miscInfo = await profile.getMiscInfo(); // Get other miscellaneous information.
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchProfile();
```

### Punishments

```js
const { Punishments } = require("pikanetwork.js");

async function fetchPunishments() {
  const playerIGN = "MrFrenco";
  const punishment = new Punishments(playerIGN);

  try {
    const punishments = await punishment.getPunishments(); // Get a list of all of the player's punishments.
    const issued = await punishment.getIssuedPunishments(); // Get a list of punishments issued by this player.
  } catch (error) {
    console.error("Error fetching punishments:", error);
  }
}

fetchPunishments();
```

### Player Leaderboard

```js
const { PlayerLeaderboard } = require("pikanetwork.js");

async function fetchPlayerLeaderboard() {
  const playerIGN = "PikaNetwork";
  const interval = "total"; // total, monthly, weekly.
  const mode = "ALL_MODES"; // ALL_MODES, SOLO, DOUBLES, TRIPLES, QUAD.
  const gamemode = "bedwars";
  // bedwars, skywars, rankedpractice, unrankedpractice, kitpvp,
  // classicskyblock, survival, lifesteal, opskyblock, oplifesteal
  // opfactions, opprison. These are all options for gamemode.
  const playerLeaderboard = new PlayerLeaderboard(playerIGN, interval, mode, gamemode);

  try {
    const leaderboard = await playerLeaderboard.getLeaderboardData(); // Get the player's leaderboard based on set parameters.
    const kdr = await playerLeaderboard.getKDR(); // Get the player's kill/death ratio.
    const fkdr = await playerLeaderboard.getFKDR(); // Get the player's final kill/final death ratio.
    const wlr = await playerLeaderboard.getWLR(); // Get the player's win/loss ratio.
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchPlayerLeaderboard();
```

### Total Leaderboard

```js
const { TotalLeaderboard } = require("pikanetwork.js");

async function fetchTotalLeaderboard() {
  const interval = "total"; // total, monthly, weekly.
  const mode = "ALL_MODES"; // ALL_MODES, SOLO, DOUBLES, TRIPLES, QUAD.
  const stat = "wins"; // Too many to be listed (varies from game to game).
  const gamemode = "bedwars";
  // bedwars, skywars, rankedpractice, unrankedpractice, kitpvp,
  // classicskyblock, survival, lifesteal, opskyblock, oplifesteal
  // opfactions, opprison. These are all options for gamemode.
  const offset = "0";
  const limit = "25";
  // The offset is at which postion the leaderboard starts (0 = #1 is the first).
  // The limit is upto how many players will be shown, the limit is capped at 25.
  const totalLeaderboard = new TotalLeaderboard(interval, mode, stat, offset, limit, gamemode);
  try {
    const leaderboard = await totalLeaderboard.fetchLeaderboardData(); // Get the total leaderboard based on set parameters.
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchTotalLeaderboard();
```

## Staff

```js
const { Staff } = require("pikanetwork.js");

async function fetchStaffList() {
  try {
    const staff = new Staff();
    const list = await staff.getStaffList();
    console.log(list);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchStaffList();
```

## Contributing

Contributions are welcome! If you have any suggestions or issues, please open an issue or pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/TejasLamba2006/pikanetwork.js/blob/main/LICENSE).

## Help

If you're having issues with a method, or the wrapper isn't working as expected, you can DM [tejaslamba](https://discord.com/users/1076942240791928875) or [mrspeedy35](https://discord.com/users/994878326319624272) on Discord.

[downloads-img]: https://img.shields.io/npm/dt/pikanetwork.js
[downloads-url]: https://www.npmtrends.com/pikanetwork.js
[npm-img]: https://img.shields.io/npm/v/pikanetwork.js
[npm-url]: https://www.npmjs.com/package/pikanetwork.js
[issues-img]: https://img.shields.io/github/issues/TejasLamba2006/pikanetwork.js
[issues-url]: https://github.com/TejasLamba2006/pikanetwork.js/issues

## Acknowledgements

Please note that the data given out by our code belongs to [PikaNetwork](https://pika-network.net/).
