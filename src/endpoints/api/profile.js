const axios = require("axios");
const cheerio = require("cheerio");
const config = require("../../jsons/config.json");
const errorConfig = require("../../jsons/error.json");

/**
 * The `Profile` class is responsible for fetching and providing various information about a player's profile on a gaming platform.
 * It uses Axios for making HTTP requests and Cheerio for parsing HTML data.
 *
 * @class
 * @summary Fetches and provides player profile information from the Pika Network API and website.
 *
 * @example
 * const profile = new Profile("player123");
 * await profile.initialize();
 * const friendList = await profile.getFriendList();
 * console.log(friendList);
 * // Output: ["friend1", "friend2", "friend3"]
 *
 * const levellingInfo = await profile.getLevellingInfo();
 * console.log(levellingInfo);
 * // Output: "rank1"
 *
 * const guildInfo = await profile.getGuildInfo();
 * console.log(guildInfo);
 * // Output: "guild1"
 *
 * const rankInfo = await profile.getRankInfo();
 * console.log(rankInfo);
 * // Output: ["rank1", "rank2", "rank3"]
 *
 * const joinInfo = await profile.getJoinInfo();
 * console.log(joinInfo);
 * // Output: {
 * //   lastJoin: "2021-01-01T12:00:00Z",
 * //   lastJoinFormatted: "January 1, 2021, 12:00 PM",
 * //   estimatedFirstJoin: "2020-12-01T12:00:00Z",
 * //   estimatedFirstJoinFormatted: "December 1, 2020, 12:00 PM"
 * // }
 *
 * const miscInfo = await profile.getMiscInfo();
 * console.log(miscInfo);
 * // Output: {
 * //   discord_boosting: true,
 * //   discord_verified: true,
 * //   email_verified: false,
 * //   username: "player123"
 * // }
 */
class Profile {
  constructor(playerIGN) {
    this.playerIGN = playerIGN;
    this.apiUrl = `https://stats.pika-network.net/api/profile/${playerIGN}`;
    this.punishmentsUrl = `https://pika-network.net/bans/search/${playerIGN}`;
    this.profileData = null;
    this.oldestPunishmentDate = null;
    this.initialized = false;
  }

  /**
   * Initializes the function by making API calls and setting up necessary data.
   *
   * @return {Promise<void>} - A Promise that resolves when the initialization is complete.
   */
  async initialize() {
    if (this.initialized) {
      return;
    }

    try {
      const [profileResponse, punishmentResponse] = await axios.all([
        axios.get(this.apiUrl),
        axios.get(this.punishmentsUrl),
      ]);

      this.handleError(profileResponse, errorConfig.profile);
      this.handleError(punishmentResponse, errorConfig.punishments);

      this.profileData = profileResponse.data;

      const $ = cheerio.load(punishmentResponse.data);
      const punishmentDates = $(".row .td._date")
        .map((_, el) => new Date($(el).text().trim()))
        .get();
      this.oldestPunishmentDate =
        punishmentDates.length === 0 ? null : new Date(Math.min(...punishmentDates));

      this.initialized = true;
    } catch (error) {
      this.handleError(error, errorConfig.responseCode);
    }
  }

  /**
   * Fetches data asynchronously.
   *
   * @return {Promise<void>} Promise that resolves when the data is fetched.
   */
  async fetchData() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  /**
   * Fetches the friend list from the profile data.
   *
   * @return {Array<string>} An array of usernames representing the friend list.
   */
  async getFriendList() {
    await this.fetchData();
    return this.profileData.friends.map(friend => friend.username);
  }

  /**
   * Retrieves the levelling information.
   *
   * @return {Promise<number>} The rank of the profile data.
   */
  async getLevellingInfo() {
    await this.fetchData();
    return this.profileData.rank;
  }

  /**
   * Retrieves the guild information.
   *
   * @return {Object} The guild information.
   */
  async getGuildInfo() {
    await this.fetchData();
    return this.profileData.clan;
  }

  /**
   * Retrieves the rank information.
   *
   * @return {Array} The array of rank information.
   */
  async getRankInfo() {
    await this.fetchData();
    return this.profileData.ranks;
  }

  /**
   * Retrieves the join information.
   *
   * @return {object} The join information.
   */
  async getJoinInfo() {
    await this.fetchData();
    const lastSeenFormatted = this.formatDate(this.profileData.lastSeen);
    const oldestPunishmentDateFormatted = this.formatDate(this.oldestPunishmentDate);

    return {
      lastJoin: this.profileData.lastSeen,
      lastJoinFormatted: lastSeenFormatted,
      estimatedFirstJoin: this.oldestPunishmentDate,
      estimatedFirstJoinFormatted: oldestPunishmentDateFormatted,
    };
  }

  /**
   * Fetches miscellaneous information from the server.
   *
   * @return {Object} An object containing various miscellaneous information:
   *   - discord_boosting: A boolean indicating whether the user has Discord boosting enabled.
   *   - discord_verified: A boolean indicating whether the user's Discord account is verified.
   *   - email_verified: A boolean indicating whether the user's email is verified.
   *   - username: The username of the user.
   */
  async getMiscInfo() {
    await this.fetchData();
    return {
      discord_boosting: this.profileData.discord_boosting,
      discord_verified: this.profileData.discord_verified,
      email_verified: this.profileData.email_verified,
      username: this.profileData.username,
    };
  }

  /**
   * Formats a given date into a human-readable format.
   *
   * @param {Date} date - The date to be formatted.
   * @return {string} The formatted date in the format "Month Day, Year, Hour:Minute AM/PM".
   */
  formatDate(date) {
    if (!date) return "N/A";

    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return new Date(date).toLocaleString("en-US", options);
  }

  /**
   * Handles the error response.
   *
   * @param {Object} response - the response object
   * @param {string} errorConfigMessage - the error config message
   * @throws {Error} if the response status is not 200
   */
  handleError(response, errorConfigMessage) {
    if (response.status !== 200) {
      throw new Error(`${config.prefix} ${errorConfigMessage}\n ${errorConfig.responseCode}`);
    }
  }
}

module.exports = Profile;
