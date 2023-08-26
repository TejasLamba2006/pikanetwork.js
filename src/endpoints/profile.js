const fetch = require("node-fetch");
const cheerio = require("cheerio");
const config = require("../config.json");

class Profile {
  constructor(playerIGN) {
    this.playerIGN = playerIGN;
    this.apiUrl = `https://stats.pika-network.net/api/profile/${playerIGN}`;
    this.punishmentsUrl = `https://pika-network.net/bans/search/${playerIGN}`;
    this.profileData = null;
    this.oldestPunishmentDate = null;
  }

  async initialize() {
    try {
      await this.fetchAllData();
    } catch (error) {
      throw new Error(
        `${config.prefix} An error occurred while initializing the profile. ${error}`
      );
    }
  }

  async fetchAllData() {
    try {
      const [profileResponse, punishmentResponse] = await Promise.all([
        fetch(this.apiUrl),
        fetch(this.punishmentsUrl),
      ]);

      if (!profileResponse.ok) {
        throw new Error(
          `${config.prefix} Failed to fetch profile data from the API. Status code: ${profileResponse.status}`
        );
      }

      const profileData = await profileResponse.json();

      if (!punishmentResponse.ok) {
        throw new Error(
          `${config.prefix} Failed to fetch punishment data from the API. Status code: ${punishmentResponse.status}`
        );
      }

      const punishmentHtml = await punishmentResponse.text();
      const $ = cheerio.load(punishmentHtml);
      const punishmentDates = Array.from($(".row .td._date")).map(
        el => new Date($(el).text().trim())
      );
      const oldestPunishmentDate =
        punishmentDates.length === 0
          ? null
          : punishmentDates.reduce((oldest, current) => (current < oldest ? current : oldest));

      this.profileData = profileData;
      this.oldestPunishmentDate = oldestPunishmentDate;
    } catch (error) {
      throw new Error(`${config.prefix} An error occurred while fetching data. ${error}`);
    }
  }

  async getFriendList() {
    await this.initialize();
    return this.profileData.friends.map(friend => friend.username);
  }

  async getLevellingInfo() {
    await this.initialize();
    return this.profileData.rank;
  }

  async getGuildInfo() {
    await this.initialize();
    return this.profileData.clan;
  }

  async getRankInfo() {
    await this.initialize();
    return this.profileData.ranks;
  }

  async getJoinInfo() {
    await this.initialize();
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
    await this.initialize();
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
}

module.exports = Profile;
