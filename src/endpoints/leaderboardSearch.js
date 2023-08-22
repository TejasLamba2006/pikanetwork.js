/**
 * Represents a leaderboard for a specific game mode and stat.
 */
class LeaderboardSearch {
    /**
     * Create a LeaderboardSearch instance.
     * @param {string} playerIGN - The player's in-game name.
     * @param {string} interval - Time period (weekly/yearly/monthly/total).
     * @param {string} mode - Game mode (SOLO/DOUBLES/TRIPLES/QUADS/ALL_MODES)
     * @param {string} gamemode - Any PikaNetwork gamemode. (e.g. opfactions, bedwars, opprison, opskyblock, classicskyblock, survival, kitpvp, practice, skywars, lifesteal)
     */
    constructor(playerIGN, interval, mode, gamemode) {
      this.playerIGN = playerIGN;
      this.interval = interval;
      this.mode = mode;
      this.gamemode = gamemode;
    }
  
    /**
     * Get the leaderboard data from the API.
     * @returns {Promise<Object>} - Leaderboard data.
     */
    async getLeaderboardData() {
      const apiUrl = `https://stats.pika-network.net/api/profile/${this.playerIGN}/leaderboard?type=${this.gamemode}&interval=${this.interval}&mode=${this.mode}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`[pikanetwork.js] Recieved a ` + response.status);
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
  
module.exports = LeaderboardSearch;