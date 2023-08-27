const axios = require("axios");
const config = require("../jsons/config.json");
const errorConfig = require("../jsons/error.json");

class TotalLeaderboard {
  constructor(interval, mode, stat, offset, limit, gamemode) {
    this.interval = interval;
    this.mode = mode;
    this.stat = stat;
    this.offset = offset;
    this.limit = limit;
    this.gamemode = gamemode;
    this.apiUrl = this.generateApiUrl();
  }

  generateApiUrl() {
    return `https://stats.pika-network.net/api/leaderboards?type=${this.gamemode}&interval=${this.interval}&stat=${this.stat}&mode=${this.mode}&offset=${this.offset}&limit=${this.limit}`;
  }

  async fetchLeaderboardData() {
    try {
      const response = await axios.get(this.apiUrl);

      if (response.status !== 200) {
        console.error(
          `${config.prefix} ${errorConfig.totalLeaderboard}\n ${errorConfig.responseCode}`
        );
        return null;
      }

      const data = response.data;
      return data;
    } catch (error) {
      console.error(`${config.prefix} ${errorConfig.totalLeaderboard}\n ${error}`);
      return null;
    }
  }
}

module.exports = TotalLeaderboard;
