const axios = require("axios");
const cheerio = require("cheerio");
const config = require("../config.json");

class Punishments {
  constructor(playerIGN) {
    this.playerIGN = playerIGN;
    this.baseUrl = "https://pika-network.net/bans/search/";
  }

  async fetchHtml(url) {
    try {
      const response = await axios.get(url);
      if (!response.status === 200) {
        throw new Error(
          `${config.prefix} Failed to fetch ban data. Status code: ${response.status}`
        );
      }
      return response.data;
    } catch (error) {
      throw new Error(`${config.prefix} Failed to fetch ban data. ${error.message}`);
    }
  }

  scrapePunishmentsData(html, isIssued = false) {
    const bans = [];
    const $ = cheerio.load(html);

    const propertyName = isIssued ? "player" : "staff";
    $(".row").each((index, element) => {
      const ban = {};

      ban.type = $(element).find(".td._type b").text().trim();
      ban[propertyName] = $(element)
        .find(isIssued ? ".td._user" : ".td._staff")
        .text()
        .trim();
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
