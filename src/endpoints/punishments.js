const fetch = require("node-fetch");
const cheerio = require("cheerio");
const config = require("../config.json");

class Punishments {
  constructor(playerIGN) {
    this.playerIGN = playerIGN;
    this.baseUrl = "https://pika-network.net/bans/search/";
  }

  async fetchHtml(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`${config.prefix} Failed to fetch ban data. Status code: ${response.status}`);
    }
    return await response.text();
  }

  scrapePunishmentsData(html, isIssued = false) {
    const bans = [];
    const $ = cheerio.load(html);

    const propertyName = isIssued ? "player" : "staff"; // Dynamic property name
    $(".row").each((index, element) => {
      const ban = {};

      ban.type = $(element).find(".td._type b").text().trim();
      ban[propertyName] = $(element)
        .find(isIssued ? ".td._user" : ".td._staff")
        .text()
        .trim(); // Use the dynamic property name
      ban.reason = $(element).find(".td._reason").text().trim();
      ban.date = $(element).find(".td._date").text().trim();
      ban.expires = $(element).find(".td._expires").text().trim();

      bans.push(ban);
    });

    return bans;
  }

  async getPunishments() {
    try {
      const url = `${this.baseUrl}${this.playerIGN}/`;
      const html = await this.fetchHtml(url);
      return this.scrapePunishmentsData(html);
    } catch (error) {
      console.error(
        `${config.prefix} An error occurred while fetching or parsing ban data. ${error}`
      );
      throw new Error(`${config.prefix} An error occurred while fetching or parsing ban data.`);
    }
  }

  async getIssuedPunishments() {
    try {
      const url = `${this.baseUrl}${this.playerIGN}/?filter=issued`;
      const html = await this.fetchHtml(url);
      return this.scrapePunishmentsData(html, true);
    } catch (error) {
      console.error(
        `${config.prefix} An error occurred while fetching or parsing ban data. ${error}`
      );
      throw new Error(`${config.prefix} An error occurred while fetching or parsing ban data.`);
    }
  }
}

module.exports = Punishments;
