const axios = require("axios");
const config = require("../config.json");

class PlayerLeaderboard {
  constructor(playerIGN, interval, mode, gamemode) {
    this.playerIGN = playerIGN;
    this.interval = interval;
    this.mode = mode;
    this.gamemode = gamemode;
    this.apiUrl = `https://stats.pika-network.net/api/profile/${this.playerIGN}/leaderboard?type=${this.gamemode}&interval=${this.interval}&mode=${this.mode}`;
    this.cachedData = null;
  }

  async fetchData() {
    if (!this.cachedData) {
      try {
        const response = await axios.get(this.apiUrl);
        if (!response.status === 200) {
          throw new Error(`${config.prefix} Received a ${response.status}`);
        }
        this.cachedData = response.data;
        if (this.cachedData.error) {
          throw new Error(`${config.prefix} ${this.cachedData.error}`);
        }
      } catch (error) {
        throw new Error(`${config.prefix} An error occurred: ${error.message}`);
      }
    }
    return this.cachedData;
  }

  async calculateRatio(entryKey1, entryKey2, data) {
    const entry1Data = data[entryKey1].entries;
    const entry2Data = data[entryKey2].entries;

    if (!entry1Data || entry1Data.length === 0 || !entry2Data || entry2Data.length === 0) {
      return "NaN";
    }

    const entry1 = parseInt(entry1Data[0].value);
    const entry2 = parseInt(entry2Data[0].value);

    if (entry1 === 0 && entry2 === 0) {
      return "NaN";
    } else if (entry1 === 0 && entry2 !== 0) {
      return entry2.toString();
    } else if (entry1 !== 0 && entry2 === 0) {
      return entry1.toString();
    } else {
      const ratio = entry1 / entry2;
      return ratio;
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
