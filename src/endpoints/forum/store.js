const axios = require("axios");
const cheerio = require("cheerio");
const _ = require("lodash");

class Store {
  constructor() {
    this.baseUrl = "https://store.pika-network.net/";
  }

  async fetchData() {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching data: " + error.message);
    }
  }

  async getRecentDonators() {
    try {
      const html = await this.fetchData();
      const $ = cheerio.load(html);

      const usernames = $(".col.icon.toggle-tooltip")
        .map((index, element) => {
          const style = $(element).attr("style");
          const usernameMatch = style.match(/https:\/\/cravatar\.eu\/helmavatar\/([^/]+)\/42\.png/);
          return usernameMatch ? usernameMatch[1] : null;
        })
        .get();

      return usernames.filter(_.identity);
    } catch (error) {
      throw new Error("Error scraping usernames: " + error.message);
    }
  }

  async getPanels() {
    try {
      const html = await this.fetchData();
      const $ = cheerio.load(html);

      const panelDataArray = $(".panel.panel-default")
        .map((index, element) => {
          const heading = $(element).find(".panel-heading").text().trim();
          const body = $(element).find(".panel-body").text().trim();

          if (heading && body) {
            const cleanedBody = _.trim(body.replace(/\n/g, " ").replace(/\s+/g, " "));
            return {
              title: heading,
              body: cleanedBody,
            };
          }
        })
        .filter(_.identity)
        .get();

      return panelDataArray;
    } catch (error) {
      throw new Error("Error scraping panel data: " + error.message);
    }
  }
}

module.exports = Store;
