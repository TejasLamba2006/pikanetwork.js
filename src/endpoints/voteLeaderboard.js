const axios = require("axios");
const cheerio = require("cheerio");

class VoteLeaderboard {
  async getLeaderboard() {
    try {
      const response = await axios.get("https://www.pika-network.net/vote");
      const responseBody = response.data;

      const parseVoterData = element => {
        const positionString = element.find(".position").first().text();
        const position = parseInt(positionString.replace(/#/g, ""), 10);
        const username = element.find(".username").text();
        const voteString = element.find(".votes span").last().text();
        const votes = parseInt(voteString.replace(/ votes/g, ""), 10);

        return { position, username, votes };
      };

      const parseLeaderboard = (html, selector) => {
        const $ = cheerio.load(html);
        const leaderboard = [];

        $(selector).each((index, element) => {
          leaderboard.push(parseVoterData($(element)));
        });

        return leaderboard;
      };

      const voters = parseLeaderboard(responseBody, ".block-voters .voter.winning");
      const runnerUps = parseLeaderboard(responseBody, ".block.runners-up .voter");

      return { voters, runnerUps };
    } catch (error) {
      throw new Error("An error occurred");
    }
  }
}

module.exports = VoteLeaderboard;
