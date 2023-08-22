/**
 * Represents a leaderboard that interacts with the Minecraft Server API.
 */
class Leaderboard {
    /**
     * Create a new Leaderboard instance.
     * @param {string} interval - Time period (weekly/yearly/monthly/total).
     * @param {string} mode - Game mode (SOLO/DOUBLES/TRIPLES/QUADS/ALL_MODES)
     * @param {string} stat - Leaderboard stat.
     * @param {number} offset - Starting position for the leaderboard.
     * @param {number} limit - Number of positions to show on the leaderboard.
     * @param {string} gamemode - Any PikaNetwork gamemode. (e.g. opfactions, bedwars, opprison, opskyblock, classicskyblock, survival, kitpvp, practice, skywars, lifesteal)
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
     * Fetches leaderboard data from the API.
     * @returns {Promise} - A Promise that resolves to the fetched data.
     */
    async fetchLeaderboardData() {
      try {
        const apiUrl = `https://stats.pika-network.net/api/leaderboards?type=${this.gamemode}&interval=${this.interval}&stat=${this.stat}&mode=${this.mode}&offset=${this.offset}&limit=${this.limit}`;
        const response = await fetch(apiUrl);
  
        if (!response.ok) {
            console.error(`[pikanetwork.js] Recieved a ` + response.status);
          throw new Error(`[pikanetwork.js] Recieved a error while searching for leaderboard data`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`[pikanetwork.js] ${error}`)
        throw new Error(`[pikanetwork.js] Got an error while searching for leaderboard data`);
      }
    }
  }
  
  module.exports = Leaderboard;
  