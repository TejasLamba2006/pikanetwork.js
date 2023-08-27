const axios = require("axios");
const cheerio = require("cheerio");
const config = require("../jsons/config.json");
const errorConfig = require("../jsons/error.json");

class VoteLeaderboard {
  constructor() {
    this.url = "https://www.pika-network.net/vote";
  }

  parseVoterData(element) {
    const positionString = element.find(".position").first().text();
    const position = parseInt(positionString.replace(/#/g, ""), 10);
    const username = element.find(".username").text();
    const voteString = element.find(".votes span").last().text();
    const votes = parseInt(voteString.replace(/ votes/g, ""), 10);

    return { position, username, votes };
  }

  parseLeaderboard(html, selector) {
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
        console.error(
          `\n${config.prefix} ${errorConfig.voteLeaderboard}\n ${errorConfig.responseCode}`
        );
      }

      const responseBody = response.data;
      const voters = this.parseLeaderboard(responseBody, ".block-voters .voter.winning");
      const runnerUps = this.parseLeaderboard(responseBody, ".block.runners-up .voter");

      return { voters, runnerUps };
    } catch (error) {
      console.error(`\n${config.prefix} ${errorConfig.voteLeaderboard}\n ${error}`);
    }
  }
}

module.exports = VoteLeaderboard;
