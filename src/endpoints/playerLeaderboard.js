const axios = require("axios");
const config = require("../jsons/config.json");
const errorConfig = require("../jsons/error.json");

class PlayerLeaderboard {
  constructor(playerIGN, interval, mode, gamemode) {
    this.playerIGN = playerIGN;
    this.interval = interval;
    this.mode = mode;
    this.gamemode = gamemode;
    this.apiUrl = `https://stats.pika-network.net/api/profile/${playerIGN}/leaderboard?type=${gamemode}&interval=${interval}&mode=${mode}`;
    this.cachedData = null;
  }

  async fetchData() {
    if (!this.cachedData) {
      try {
        const response = await axios.get(this.apiUrl);
        if (response.status !== 200) {
          console.error(
            `${config.prefix} ${errorConfig.playerLeaderboard}\n ${errorConfig.responseCode}`
          );
          return null;
        }
        this.cachedData = response.data;
        if (this.cachedData.error) {
          console.error(
            `${config.prefix} ${errorConfig.playerLeaderboard}\n ${this.cachedData.error}`
          );
          return null;
        }
      } catch (error) {
        console.error(`${config.prefix} ${errorConfig.playerLeaderboard}\n ${error}`);
        return null;
      }
    }
    return this.cachedData;
  }

  calculateRatio(entryKey1, entryKey2, data) {
    const entry1Data = data[entryKey1]?.entries;
    const entry2Data = data[entryKey2]?.entries;

    if (!entry1Data?.length || !entry2Data?.length) {
      return NaN;
    }

    const entry1 = parseInt(entry1Data[0].value);
    const entry2 = parseInt(entry2Data[0].value);

    if (entry1 === 0 && entry2 === 0) {
      return NaN;
    } else if (entry1 === 0) {
      return entry2;
    } else if (entry2 === 0) {
      return entry1;
    } else {
      const ratio = entry1 / entry2;
      return parseFloat(ratio.toFixed(2));
    }
  }

  async getLeaderboardData() {
    return this.fetchData();
  }

  async getRatioData() {
    const data = await this.fetchData();

    let ratioKeys = [
      {
        key1: "Kills",
        key2: "Deaths",
        info: "Kills/Deaths",
        ratioName: "killDeathRatio",
        infoName: "kdrInfo",
      },
      {
        key1: "Wins",
        key2: "Losses",
        info: "Wins/Losses",
        ratioName: "winLossRatio",
        infoName: "wlrInfo",
      },
      {
        key1: "Wins",
        key2: "Games played",
        info: "Wins/Games Played",
        ratioName: "winPlayRatio",
        infoName: "wprInfo",
      },
      {
        key1: "Arrows shot",
        key2: "Arrows hit",
        info: "Arrows Shot/Arrows Hit",
        ratioName: "arrowsHitShotRatio",
        infoName: "ahsrInfo",
      },
    ];

    if (this.gamemode === "bedwars") {
      ratioKeys.push({
        key1: "Final kills",
        key2: "Losses",
        info: "Final Kills/Final Deaths",
        ratioName: "finalKillDeathRatio",
        infoName: "fkdrInfo",
      });
    }

    const ratios = {};

    const ratioPromises = ratioKeys.map(async ({ key1, key2, info, ratioName, infoName }) => {
      const ratio = await this.calculateRatio(key1, key2, data);
      ratios[ratioName] = ratio;
      ratios[infoName] = info;
    });

    await Promise.all(ratioPromises);

    return ratios;
  }
}

module.exports = PlayerLeaderboard;
