const axios = require("axios");
const cheerio = require("cheerio");
const config = require("../jsons/config.json");
const errorConfig = require("../jsons/error.json");

class Staff {
  /**
   * Represents a staff object that scrapes a staff list from a given URL and returns it as an object.
   * @constructor
   */
  constructor() {
    this.staffRoles = new Set([
      "owner",
      "manager",
      "lead developer",
      "developer",
      "admin",
      "sr mod",
      "moderator",
      "helper",
      "trial",
    ]);
  }

  /**
   * Scrapes the staff list from the given URL.
   * @param {string} url - The URL to scrape the staff list from.
   * @returns {Object} - The staff object containing staff usernames grouped by role.
   * @throws {Error} - If there is an error during the scraping process.
   */
  async scrapeStaffList(url) {
    try {
      const response = await axios.get(url);
      if (response.status !== 200) {
        console.error(`${config.prefix} ${errorConfig.staff}\n ${errorConfig.responseCode}`);
      }

      const staff = this.initializeStaffObject();
      const $ = cheerio.load(response.data);

      $("span").each((_i, el) => {
        const text = $(el).text().trim().toLowerCase();
        if (this.staffRoles.has(text)) {
          const role = text.replace(/\s/g, "");
          const username = $(el).prev().text().trim().replace(/\s/g, "");
          staff[role].push(username);
        }
      });

      return staff;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves the staff list from the default URL.
   * @returns {Object} - The staff object containing staff usernames grouped by role.
   * @throws {Error} - If there is an error during the scraping process.
   */
  async getStaffList() {
    const url = "https://pika-network.net/staff/";
    return await this.scrapeStaffList(url);
  }

  /**
   * Initializes a staff object with empty arrays for each staff role.
   * @returns {Object} - The initialized staff object.
   */
  initializeStaffObject() {
    const staff = {};
    for (const role of this.staffRoles) {
      const roleName = role.replace(/\s/g, "");
      staff[roleName] = [];
    }
    return staff;
  }
}

module.exports = Staff;
