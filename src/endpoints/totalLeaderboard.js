const axios = require("axios");
const { prefix } = require("../jsons/config.json");
const errorConfig = require("../jsons/error.json");

class TotalLeaderboard {
  constructor(interval, mode, stat, offset, limit, gamemode) {
    this.interval = interval;
    this.mode = mode;
    this.stat = stat;
    this.offset = offset;
    this.limit = limit;
    this.gamemode = gamemode;
  }

  generateApiUrl() {
    return `https://stats.pika-network.net/api/leaderboards?type=${this.gamemode}&interval=${this.interval}&stat=${this.stat}&mode=${this.mode}&offset=${this.offset}&limit=${this.limit}`;
  }

  async fetchLeaderboardData() {
    try {
      const apiUrl = this.generateApiUrl();
      const response = await axios.get(apiUrl);

      if (response.status !== 200) {
        console.error(`${prefix} ${errorConfig.totalLeaderboard}\n ${errorConfig.responseCode}`);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`${prefix} ${errorConfig.totalLeaderboard}\n ${error}`);
      return null;
    }
  }
}

module.exports = TotalLeaderboard;
