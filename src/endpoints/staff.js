const axios = require("axios");
const cheerio = require("cheerio");
const config = require("../config.json");

class Staff {
  constructor() {
    this.staffRoles = [
      "owner",
      "manager",
      "lead developer",
      "developer",
      "admin",
      "sr mod",
      "moderator",
      "helper",
      "trial",
    ];
  }

  async scrapeStaffList(url) {
    try {
      const response = await axios.get(url);
      if (response.status !== 200) {
        throw new Error(
          `${config.prefix} Received status code ${response.status} while scraping ${url}.`
        );
      }

      const $ = cheerio.load(response.data);
      const staff = this.initializeStaffObject();

      $("span").each((i, el) => {
        const text = $(el).text().trim().toLowerCase();
        const roleIndex = this.staffRoles.indexOf(text);
        if (roleIndex !== -1) {
          const role = this.staffRoles[roleIndex].replace(/\s/g, "");
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
    const staff = await this.scrapeStaffList(url);
    return staff;
  }

  initializeStaffObject() {
    return this.staffRoles.reduce((obj, role) => {
      const roleName = role.replace(/\s/g, "");
      obj[roleName] = [];
      return obj;
    }, {});
  }
}

module.exports = Staff;
