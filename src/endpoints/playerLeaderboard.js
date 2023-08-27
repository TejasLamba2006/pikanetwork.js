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

  async calculateRatio(entryKey1, entryKey2, data) {
    const entry1Data = data[entryKey1]?.entries;
    const entry2Data = data[entryKey2]?.entries;

    if (!entry1Data?.length || !entry2Data?.length) {
      return "NaN";
    }

    const entry1 = parseInt(entry1Data[0].value);
    const entry2 = parseInt(entry2Data[0].value);

    if (entry1 === 0 && entry2 === 0) {
      return "NaN";
    } else if (entry1 === 0) {
      return entry2.toString();
    } else if (entry2 === 0) {
      return entry1.toString();
    } else {
      const ratio = entry1 / entry2;
      return ratio.toFixed(2);
    }
  }

  async getLeaderboardData() {
    return this.fetchData();
  }

  async getKDR() {
    const data = await this.fetchData();
    return this.calculateRatio("Kills", "Deaths", data);
  }

  async getFKDR() {
    const data = await this.fetchData();
    return this.calculateRatio("Final kills", "Losses", data);
  }

  async getWLR() {
    const data = await this.fetchData();
    return this.calculateRatio("Wins", "Losses", data);
  }
}

module.exports = PlayerLeaderboard;
