const axios = require("axios");
const { prefix } = require("../jsons/config.json");
const errorConfig = require("../jsons/error.json");

class TotalLeaderboard {
  /**
   * Represents a leaderboard for fetching data from the Pika Network API.
   * @param {string} interval - The interval for the leaderboard data (e.g., "daily", "weekly").
   * @param {string} mode - The mode for the leaderboard data (e.g., "solo", "team").
   * @param {string} stat - The stat for the leaderboard data (e.g., "kills", "wins").
   * @param {number} offset - The offset for the leaderboard data (e.g., 0, 10).
   * @param {number} limit - The limit for the leaderboard data (e.g., 10, 20).
   * @param {string} gamemode - The gamemode for the leaderboard data (e.g., "skywars", "bedwars").
   */
  constructor(interval, mode, stat, offset, limit, gamemode) {
    this.interval = interval;
    this.mode = mode;
    this.stat = stat;
    this.offset = offset;
    this.limit = limit;
    this.gamemode = gamemode;
  }

  /**
   * Generates the API URL based on the instance's properties.
   * @returns {string} The generated API URL.
   */
  generateApiUrl() {
    return `https://stats.pika-network.net/api/leaderboards?type=${this.gamemode}&interval=${this.interval}&stat=${this.stat}&mode=${this.mode}&offset=${this.offset}&limit=${this.limit}`;
  }

  /**
   * Fetches the leaderboard data from the generated API URL.
   * @returns {Promise} A promise that resolves with the leaderboard data or null if an error occurs.
   */
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
