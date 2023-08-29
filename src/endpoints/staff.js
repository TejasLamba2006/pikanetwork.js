const axios = require("axios");
const cheerio = require("cheerio");
const config = require("../jsons/config.json");
const errorConfig = require("../jsons/error.json");

class Staff {
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

  async getStaffList() {
    const url = "https://pika-network.net/staff/";
    return await this.scrapeStaffList(url);
  }

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
