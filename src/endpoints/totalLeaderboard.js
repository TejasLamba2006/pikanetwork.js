const fetch = require("node-fetch"); // Import the fetch function
const config = require("../config.json");

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
    const apiUrl = `https://stats.pika-network.net/api/leaderboards?type=${this.gamemode}&interval=${this.interval}&stat=${this.stat}&mode=${this.mode}&offset=${this.offset}&limit=${this.limit}`;
    return apiUrl;
  }

  async fetchLeaderboardData() {
    try {
      const response = await fetch(this.apiUrl);

      if (!response.ok) {
        console.error(`${config.prefix} Received an error with status: ${response.status}`);
        throw new Error(`${config.prefix} Error while fetching leaderboard data`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`${config.prefix} ${error}`);
      throw new Error(`${config.prefix} Error while fetching leaderboard data`);
    }
  }
}

module.exports = TotalLeaderboard;
