# `pikanetwork.js` Documentation

Welcome to the documentation for the `pikanetwork.js` npm package! This package provides a simple and convenient way to interact with the PikaNetwork API, allowing you to retrieve player profiles, leaderboard data, and PikaBans information.

# Table of Contents
- [`pikanetwork.js` Documentation](#pikanetworkjs-documentation)
- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
- [Installation](#installation)
- [`Profile` Class](#profile-class)
  - [Introduction](#introduction-1)
  - [Usage](#usage)
  - [Methods](#methods)
- [`Leaderboard` Class](#leaderboard-class)
  - [Introduction](#introduction-2)
  - [Usage](#usage-1)
  - [Methods](#methods-1)
- [`PikaBansScraper` Class](#pikabansscraper-class)
  - [Introduction](#introduction-3)
  - [Usage](#usage-2)
  - [Methods](#methods-2)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)


# Introduction

The `pikanetwork.js` package was created to provide an easy-to-use option for developers who want to integrate PikaNetwork API functionalities into their projects. The PikaNetwork API provides valuable data related to player statistics, leaderboards, and ban information. However, accessing and processing this data can be complex. This library aims to simplify the process by offering intuitive classes and methods that abstract away the API intricacies.

# Installation

You can install the `pikanetwork.js` package via npm:

```bash
npm install pikanetwork.js
```

# `Profile` Class

The `Profile` class allows you to retrieve a player's profile information from the PikaNetwork server API.

## Introduction

The `Profile` class provides methods to fetch various pieces of information about a player's profile, including friend list, rank information, guild information, last seen information, and other details.

## Usage

To use the `Profile` class, first, you need to import it into your code:

```js
const { Profile } = require('pikanetwork.js');
```
Then, you can create an instance of the `Profile` class using a player's in-game name (IGN):
```js
const playerIGN = 'TejasIsPro';
const profile = new Profile(playerIGN);
```
## Methods
- `fetchProfileData()`: Fetches the player's profile data from the PikaNetwork API. This method must be called before any other methods in the `Profile` class.
```js
const profileData = await profile.fetchProfileData();
```
- `getFriendList()`: Returns an array of the player's friends' IGNs.
```js
const friendList = profile.getFriendList();
```
Output

```js
[
  'Emojin',      'divi2224',
  'saharsh1218', 'RGFLAMERZ',
  'TejasLamba',  'lqvmr',
  'wxplo',       'Paradox28',
  'UnFaZed_',    'pooja'
]
```
- `getRankInfo()`: Returns an object containing the player's rank information, including rank name, rank color, and rank prefix.
```js
const rankInfo = await profile.getRankInfo();
```
Output

```js
{
  level: 45,
  experience: 2171,
  percentage: 52,
  rankDisplay: '&8[&fIron&8]&f '
}
```
- `getGuildInfo()`: Returns an object containing the player's guild information, including guild name, guild tag, and guild color.
```js
const guildInfo = await profile.getGuildInfo();
```
Output

```js
{
  name: 'Sanatan',
  tag: 'HINDU',
  currentTrophies: 0,
  creationTime: '2023-06-21T10:01:20',
  members: [
    { user: [Object], joinDate: '2023-06-23T10:13:48' },
    { user: [Object], joinDate: '2023-07-04T13:34:05' },
    { user: [Object], joinDate: '2023-07-25T07:18:41' },
    { user: [Object], joinDate: '2023-08-10T03:49:17' },
    { user: [Object], joinDate: '2023-08-10T03:54:04' },
    { user: [Object], joinDate: '2023-06-21T10:58:36' },
    { user: [Object], joinDate: '2023-08-18T11:44:30' },
    { user: [Object], joinDate: '2023-06-23T10:02:29' },
    { user: [Object], joinDate: '2023-06-28T04:53:20' },
    { user: [Object], joinDate: '2023-06-21T10:43:39' },
    { user: [Object], joinDate: '2023-08-10T03:46:17' },
    { user: [Object], joinDate: '2023-06-28T06:28:14' },
    { user: [Object], joinDate: '2023-06-21T10:47:31' },
    { user: [Object], joinDate: '2023-07-05T06:17:27' },
    { user: [Object], joinDate: '2023-07-09T05:19:53' },
    { user: [Object], joinDate: '2023-06-21T11:11:27' },
    { user: [Object], joinDate: '2023-06-21T10:35:08' },
    { user: [Object], joinDate: '2023-06-21T12:38:49' },
    { user: [Object], joinDate: '2023-08-20T14:03:48' },
    { user: [Object], joinDate: '2023-06-21T10:01:20' },
    { user: [Object], joinDate: '2023-06-21T13:15:21' },
    { user: [Object], joinDate: '2023-08-10T03:52:36' },
    { user: [Object], joinDate: '2023-08-10T04:04:01' },
    { user: [Object], joinDate: '2023-06-26T09:51:33' }
  ],
  owner: { username: 'RGFLAMERZ' },
  leveling: { level: 29, exp: 1794, totalExp: 237460 }
}
```
- `getLastSeenInfo()`: Returns an object containing the player's last time.
```js
const lastSeenInfo = await profile.getLastSeenInfo();
```
Output

```js
1692550423423
```
- `getOtherThings()`: Gets other miscellaneous information about the player's profile.
```js
const otherThings = await profile.getOtherThings();
```
Output

```js
{ discord_boosting: false, email_verified: true }
```

# `Leaderboard` Class
The `Leaderboard` class enables you to retrieve leaderboard data for a specific game mode and stat from the PikaNetwork server API.

## Introduction
The `Leaderboard` class simplifies the process of fetching leaderboard data, such as Kill Death Ratio (KDR), Final Kill Death Ratio (FKDR), and Win Loss Ratio (WLR) for a player. It abstracts away the complexities of API interactions, allowing developers to seamlessly integrate leaderboard statistics into their applications.

## Usage
To utilize the functionalities provided by the `Leaderboard` class, first, import it into your code:
```js
const { Leaderboard } = require('pikanetwork.js');
```
Next, create an instance of the `Leaderboard` class by providing the required parameters:
```js
const playerIGN = 'TejasIsPro';
const interval = 'total';
const mode = 'SOLO';
const offset = 0;
const limit = 10;
const gamemode = 'bedwars';

const leaderboard = new Leaderboard(playerIGN, interval, mode, offset, limit, gamemode);
```
## Methods
- `getLeaderboardData()`: Fetches the leaderboard data from the PikaNetwork API. This method must be called before any other methods in the `Leaderboard` class.
```js
const leaderboardData = await leaderboard.getLeaderboardData();
```
Output 
<details>
```js
{
  "Bow kills": {
    "metadata": {
      "total": 24011
    },
    "entries": [
      {
        "place": 111,
        "value": "48",
        "id": "TejasIsPro"
      }
    ]
  },
  "Kills": {
    "metadata": {
      "total": 650578
    },
    "entries": [
      {
        "place": 3705,
        "value": "2626",
        "id": "TejasIsPro"
      }
    ]
  },
  "Games played": {
    "metadata": {
      "total": 842232
    },
    "entries": [
      {
        "place": 10460,
        "value": "606",
        "id": "TejasIsPro"
      }
    ]
  },
  "Arrows shot": {
    "metadata": {
      "total": 143922
    },
    "entries": [
      {
        "place": 607,
        "value": "838",
        "id": "TejasIsPro"
      }
    ]
  },
  "Highest winstreak reached": {
    "metadata": {
      "total": 164600
    },
    "entries": [
      {
        "place": 8983,
        "value": "5",
        "id": "TejasIsPro"
      }
    ]
  },
  "Beds destroyed": {
    "metadata": {
      "total": 529821
    },
    "entries": [
      {
        "place": 8549,
        "value": "693",
        "id": "TejasIsPro"
      }
    ]
  },
  "Losses": {
    "metadata": {
      "total": 743730
    },
    "entries": [
      {
        "place": 13377,
        "value": "360",
        "id": "TejasIsPro"
      }
    ]
  },
  "Arrows hit": {
    "metadata": {
      "total": 115782
    },
    "entries": [
      {
        "place": 617,
        "value": "244",
        "id": "TejasIsPro"
      }
    ]
  },
  "Melee kills": {
    "metadata": {
      "total": 358643
    },
    "entries": [
      {
        "place": 2775,
        "value": "1885",
        "id": "TejasIsPro"
      }
    ]
  },
  "Final kills": {
    "metadata": {
      "total": 479538
    },
    "entries": [
      {
        "place": 7396,
        "value": "627",
        "id": "TejasIsPro"
      }
    ]
  },
  "Deaths": {
    "metadata": {
      "total": 767970
    },
    "entries": [
      {
        "place": 12583,
        "value": "1994",
        "id": "TejasIsPro"
      }
    ]
  },
  "Void kills": {
    "metadata": {
      "total": 505438
    },
    "entries": [
      {
        "place": 4680,
        "value": "671",
      }
    ]
  },
  "Wins": {
    "metadata": {
      "total": 300560
    },
      {
        "place": 6284,
        "value": "150",
        "id": "TejasIsPro"
      }
    ]
  }
  ```
</details>

- `getKDR()`: This method calculates and returns the Kill Death Ratio (KDR) for the player.
```js
const kdr = leaderboard.getKDR();
```
Output

```js
1.31
```
- `getFKDR()`: This method calculates and returns the Final Kill Death Ratio (FKDR) for the player.
```js
const fkdr = leaderboard.getFKDR();
```
Output

```js
1.39
```
- `getWLR()`: This method calculates and returns the Win Loss Ratio (WLR) for the player.
```js
const wlr = leaderboard.getWLR();
```
Output

```js
0.40
```

# `PikaBansScraper` Class
The PikaBansScraper class allows you to scrape ban data from the Pika Network bans search page.

## Introduction
The `PikaBansScraper` class provides an easy-to-use way to retrieve ban information for a given player's in-game name (IGN) by scraping data from the Pika Network bans search page. It utilizes the `node-fetch` and `cheerio` libraries to fetch and parse the HTML content of the bans search page.

## Usage
To use the `PikaBansScraper` class, first, import it into your code:
```js
const { PikaBansScraper } = require('pikanetwork.js');
```
Next, create an instance of the PikaBansScraper class using the player's in-game name (IGN):
```js
const playerIGN = 'TejasIsPro';
const bansScraper = new PikaBansScraper(playerIGN);
```
## Methods
- `scrapeBanData(html)`:
  - `html`: The HTML content of the Pika Network bans search page.
  - Returns an object containing the player's ban information.
```js
const html = ... // HTML content of the bans search page
const bans = PikaBansScraper.scrapeBanData(html);
```
**Note**: This method is automatically called when you call the `getBanData()` method. Also note that this is not required to use am just stating it here for people who want to use it.

- `getBanData()`: Fetches the ban data from the Pika Network bans search page and returns an object containing the player's ban information.
```js
const bans = await bansScraper.getBanData();
```

Outputs
```js
[
    {
    type: 'ban',
    staff: 'CONSOLE',
    reason: '[VL#5] [BedWars] Client Modification (002)',
    date: 'November 6, 2021, 10:28',
    expires: 'November 07, 2021, 10:28 (Expired)'
  },
  {
    type: 'kick',
    staff: 'CONSOLE',
    reason: '[VL#1] [BedWars] Client Modification (002)',
    date: 'November 6, 2021, 09:37',
    expires: 'N/A'
  }
]
```

# Contributing
Contributions are welcome! If you have any suggestions or issues, please open an issue or pull request.

# License
This project is licensed under the MIT License. See the [LICENSE]()

# Contact
If you have any questions, feel free to contact me on Discord: `@tejaslamba`

# Acknowledgements
- [PikaNetwork](https://pika-network.net/)