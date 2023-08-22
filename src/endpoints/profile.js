/**
 * Represents a player's profile fetched from the Minecraft server API.
 */
class Profile {
  /**
   * Creates an instance of Profile.
   * @param {string} playerIGN - The player's in-game name (IGN).
   */
  constructor(playerIGN) {
    this.playerIGN = playerIGN;
    this.apiUrl = `https://stats.pika-network.net/api/profile/${playerIGN}`;
  }

  /**
   * Fetches the player's profile data from the API.
   * @returns {Promise<object>} - The player's profile data.
   */
  async fetchProfileData() {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        console.error(`[pikanetwork.js] Failed to fetch data from the API. Status code: ${response.status}`);
        throw new Error('[pikanetwork.js] Failed to fetch data from the API.');
      }
      const data = await response.json();
      return data;
    } catch (error) {
        console.error(`[pikanetwork.js] An error occurred while fetching data. ${error}`);
        throw new Error('[pikanetwork.js] An error occurred while fetching data.');
    }
  }

  /**
   * Gets the player's friend list.
   * @returns {Promise<Array>} - List of friend usernames.
   */
  async getFriendList() {
    const data = await this.fetchProfileData();
    return data.friends.map(friend => friend.username);
  }

  /**
   * Gets the player's rank information.
   * @returns {Promise<object>} - Rank information.
   */
  async getRankInfo() {
    const data = await this.fetchProfileData();
    return data.rank;
  }

  /**
   * Gets the player's guild information.
   * @returns {Promise<object>} - Guild information.
   */
  async getGuildInfo() {
    const data = await this.fetchProfileData();
    return data.clan;
  }
  /**
   * Gets the player's last seen information.
   * @returns {Promise<Number>} - Last seen information.
   */
    async getLastSeenInfo() {
        const data = await this.fetchProfileData();
        return data.lastSeen;
}

    /**
     * Gets the other things.
    * @returns {Promise<object>} - Other things.
    */
   async getOtherThings() {
    const data = await this.fetchProfileData();
    return {
        discord_boosting: data.discord_boosting,
        email_verified: data.email_verified
    };
}
}
// Export the Profile class
module.exports = Profile;
