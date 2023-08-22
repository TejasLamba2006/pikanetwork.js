/**
 * Represents a leaderboard for a specific game mode and stat.
 */
class Leaderboard {
    /**
     * Create a Leaderboard instance.
     * @param {string} playerIGN - The player's in-game name.
     * @param {string} interval - Time period (weekly/yearly/monthly/total).
     * @param {string} mode - Game mode.
     * @param {number} offset - Starting position in the leaderboard.
     * @param {number} limit - Number of entries to retrieve.
     * @param {string} gamemode - PikaNetwork gamemode.
     */
    constructor(playerIGN, interval, mode, offset, limit, gamemode) {
      this.playerIGN = playerIGN;
      this.interval = interval;
      this.mode = mode;
      this.offset = offset;
      this.limit = limit;
      this.gamemode = gamemode;
    }
  
    /**
     * Get the leaderboard data from the API.
     * @returns {Promise<Object>} - Leaderboard data.
     */
    async getLeaderboardData() {
      const apiUrl = `https://stats.pika-network.net/api/profile/${this.playerIGN}/leaderboard?type=${this.gamemode}&interval=${this.interval}&mode=${this.mode}&offset=${this.offset}&limit=${this.limit}`;
      console.log(apiUrl);
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.error) throw new Error(`[pikanetwork.js]` + data.error);
      return data;
    }
  
    /**
     * Get the Kill Death Ratio (KDR) of the player.
     * @returns {Promise<number>} - KDR value.
     */
    async getKDR() {
      const data = await this.getLeaderboardData();
      // Calculate KDR
      const kills = parseInt(data["Kills"].entries[0].value);
      const deaths = parseInt(data['Deaths'].entries[0].value);
      const kdr = kills / deaths;
      return kdr;
    }
  
    /**
     * Get the Final Kill Death Ratio (FKDR) of the player.
     * @returns {Promise<number>} - FKDR value.
     */
    async getFKDR() {
      const data = await this.getLeaderboardData();
      // Calculate FKDR
      const finalKills = parseInt(data['Final kills'].entries[0].value);
      const deaths = parseInt(data['Deaths'].entries[0].value);
      const fkdr = finalKills / deaths;
      return fkdr;
    }
  
    /**
     * Get the Win Loss Ratio (WLR) of the player.
     * @returns {Promise<number>} - WLR value.
     */
    async getWLR() {
      const data = await this.getLeaderboardData();
      // Calculate WLR
      const wins = parseInt(data['Wins'].entries[0].value);
      const losses = parseInt(data['Losses'].entries[0].value);
      const wlr = wins / losses;
      return wlr;
    }
  }
  
module.exports = Leaderboard;