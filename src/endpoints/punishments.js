const axios = require("axios");
const cheerio = require("cheerio");
const config = require("../jsons/config.json");
const errorConfig = require("../jsons/error.json");

class Punishments {
  constructor(playerIGN) {
    this.playerIGN = playerIGN;
    this.baseUrl = "https://pika-network.net/bans/search/";
    this.fetchHtml = this.fetchHtml.bind(this);
  }

  async fetchHtml(url) {
    try {
      const response = await axios.get(url);
      if (response.status !== 200) {
        throw new Error(
          `${config.prefix} ${errorConfig.punishments}\n ${errorConfig.responseCode}`
        );
      }
      return response.data;
    } catch (error) {
      throw new Error(`${config.prefix} ${errorConfig.punishments}\n ${error}`);
    }
  }

  scrapePunishmentsData(html, isIssued = false) {
    const bans = [];
    const $ = cheerio.load(html);

    const propertyName = isIssued ? "player" : "staff";
    $(".row").each((index, element) => {
      const $element = $(element);
      const ban = {
        type: $element.find(".td._type b").text().trim(),
        [propertyName]: $element
          .find(isIssued ? ".td._user" : ".td._staff")
          .text()
          .trim(),
        reason: $element.find(".td._reason").text().trim(),
        date: $element.find(".td._date").text().trim(),
        expires: $element.find(".td._expires").text().trim(),
      };

      bans.push(ban);
    });

    return bans;
  }

  async getPunishments() {
    const url = `${this.baseUrl}${this.playerIGN}/`;
    const html = await this.fetchHtml(url);
    return this.scrapePunishmentsData(html);
  }

  async getIssuedPunishments() {
    const url = `${this.baseUrl}${this.playerIGN}/?filter=issued`;
    const html = await this.fetchHtml(url);
    return this.scrapePunishmentsData(html, true);
  }
}

module.exports = Punishments;
