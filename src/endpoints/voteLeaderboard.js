const axios = require("axios");
const cheerio = require("cheerio");

class VoteLeaderboard {
  async getLeaderboard() {
    try {
      const response = await axios.get("https://www.pika-network.net/vote/");
      const responseBody = response.data;
      const $ = cheerio.load(responseBody);

      const extractVoterData = element => {
        const positionString = $(element).find(".position").first().text();
        const position = parseInt(positionString.replace(/#/g, ""), 10);
        const username = $(element).find(".username").text();
        const voteString = $(element).find(".votes span").last().text();
        const votes = parseInt(voteString.replace(/ votes/g, ""), 10);

        return { position, username, votes };
      };

      const leaderboard = {
        voters: [],
        runnerUps: [],
      };

      $(".block-voters .voter.winning").each((index, element) => {
        leaderboard.voters.push(extractVoterData(element));
      });

      $(".block.runners-up .voter").each((index, element) => {
        leaderboard.runnerUps.push(extractVoterData(element));
      });

      return leaderboard;
    } catch (error) {
      console.error("An error occurred:", error);
      return [];
    }
  }
}

module.exports = VoteLeaderboard;
