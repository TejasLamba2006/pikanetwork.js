const axios = require("axios");
const cheerio = require("cheerio");
const config = require("../jsons/config.json");
const errorConfig = require("../jsons/error.json");

class Profile {
  constructor(playerIGN) {
    this.playerIGN = playerIGN;
    this.apiUrl = `https://stats.pika-network.net/api/profile/${playerIGN}`;
    this.punishmentsUrl = `https://pika-network.net/bans/search/${playerIGN}`;
    this.profileData = null;
    this.oldestPunishmentDate = null;
    this.initialized = false;
  }

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

  async fetchData() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  async getFriendList() {
    await this.fetchData();
    return this.profileData.friends.map(friend => friend.username);
  }

  async getLevellingInfo() {
    await this.fetchData();
    return this.profileData.rank;
  }

  async getGuildInfo() {
    await this.fetchData();
    return this.profileData.clan;
  }

  async getRankInfo() {
    await this.fetchData();
    return this.profileData.ranks;
  }

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

  async getMiscInfo() {
    await this.fetchData();
    return {
      discord_boosting: this.profileData.discord_boosting,
      discord_verified: this.profileData.discord_verified,
      email_verified: this.profileData.email_verified,
      username: this.profileData.username,
    };
  }

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

  handleError(response, errorConfigMessage) {
    if (response.status !== 200) {
      throw new Error(`${config.prefix} ${errorConfigMessage}\n ${errorConfig.responseCode}`);
    }
  }
}

module.exports = Profile;
