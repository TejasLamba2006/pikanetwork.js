/**
 * Class representing a PlayerLeaderboard.
 * Fetches data from an API and calculates various ratios based on the fetched data.
 *
 * @constructor
 * @param {string} playerIGN - The IGN (In-Game Name) of the player.
 * @param {string} interval - The time interval for the leaderboard data.
 * @param {string} mode - The mode for the leaderboard data.
 * @param {string} gamemode - The game mode for the leaderboard data.
 *
 * @example
 * const leaderboard = new PlayerLeaderboard("playerIGN", "interval", "mode", "gamemode");
 * const data = await leaderboard.getRatioData();
 * console.log(data);
 *
 * @returns {Object} - An object containing various ratios based on the fetched data.
 *   - killDeathRatio (number): The ratio of kills to deaths.
 *   - kdrInfo (string): Information about the kills to deaths ratio.
 *   - winLossRatio (number): The ratio of wins to losses.
 *   - wlrInfo (string): Information about the wins to losses ratio.
 *   - winPlayRatio (number): The ratio of wins to games played.
 *   - wprInfo (string): Information about the wins to games played ratio.
 *   - arrowsHitShotRatio (number): The ratio of arrows hit to arrows shot.
 *   - ahsrInfo (string): Information about the arrows hit to arrows shot ratio.
 *   - finalKillDeathRatio (number, only for "bedwars" gamemode): The ratio of final kills to final deaths.
 *   - fkdrInfo (string, only for "bedwars" gamemode): Information about the final kills to final deaths ratio.
 */
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

  /**
   * Fetches data from the API if it is not already cached.
   *
   * @return {Object|null} The fetched data, or null if an error occurred.
   */
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

  /**
   * Calculate the ratio between two entries in the given data.
   *
   * @param {string} entryKey1 - The key of the first entry.
   * @param {string} entryKey2 - The key of the second entry.
   * @param {object} data - The data object that contains the entries.
   * @return {number} The calculated ratio between the entries, rounded to 2 decimal places.
   */
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

  /**
   * Retrieves the leaderboard data asynchronously.
   *
   * @return {Promise<any>} A Promise that resolves to the leaderboard data.
   */
  async getLeaderboardData() {
    return this.fetchData();
  }

  /**
   * Retrieves ratio data from the server.
   *
   * @return {Object} Object containing various ratio values.
   */
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
