const axios = require("axios");
const cheerio = require("cheerio");
const config = require("../jsons/config.json");
const errorConfig = require("../jsons/error.json");

class VoteLeaderboard {
  constructor() {
    this.url = "https://www.pika-network.net/vote";
  }

  parseVoterData(element) {
    const position = parseInt(element.find(".position").first().text().replace(/#/g, ""), 10);
    const username = element.find(".username").text();
    const votes = parseInt(
      element
        .find(".votes span")
        .last()
        .text()
        .replace(/ votes/g, ""),
      10
    );

    return { position, username, votes };
  }

  async parseLeaderboard(html, selector) {
    const $ = cheerio.load(html);
    const leaderboard = [];

    $(selector).each((index, element) => {
      leaderboard.push(this.parseVoterData($(element)));
    });

    return leaderboard;
  }

  async getLeaderboard() {
    try {
      const response = await axios.get(this.url);

      if (response.status !== 200) {
        throw new Error(
          `${config.prefix} ${errorConfig.voteLeaderboard}\n ${errorConfig.responseCode}`
        );
      }

      const responseBody = response.data;
      const [voters, runnerUps] = await Promise.all([
        this.parseLeaderboard(responseBody, ".block-voters .voter.winning"),
        this.parseLeaderboard(responseBody, ".block.runners-up .voter"),
      ]);

      return { voters, runnerUps };
    } catch (error) {
      throw new Error(`${config.prefix} ${errorConfig.voteLeaderboard}\n ${error}`);
    }
  }
}

module.exports = VoteLeaderboard;
