const axios = require("axios");
const cheerio = require("cheerio");

class VoteLeaderboard {
  async getLeaderboard() {
    try {
      const response = await axios.get(`https://www.pika-network.net/vote/`);
      const responseBody = response.data;
      const $ = cheerio.load(responseBody);

      const leaderboard = {
        voters: [],
        runnerUps: [],
      };

      $(".block-voters .voter.winning").each((index, element) => {
        const position = $(element).find(".position").first().text();

        const username = $(element).find(".username").text();
        const votes = $(element).find(".votes span").last().text();

        leaderboard.voters.push({
          position,
          username,
          votes,
        });
      });

      // Extract data from the runners-up section
      $(".block.runners-up .voter").each((index, element) => {
        const position = $(element).find(".position").first().text();
        const username = $(element).find(".username").text();
        const votes = $(element).find(".votes span").last().text();

        leaderboard.runnerUps.push({
          position,
          username,
          votes,
        });
      });

      return leaderboard;
    } catch (error) {
      console.error("An error occurred:", error);
      return [];
    }
  }
}

module.exports = VoteLeaderboard;
