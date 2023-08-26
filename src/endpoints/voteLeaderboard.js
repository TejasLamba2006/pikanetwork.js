const axios = require("axios");
const cheerio = require("cheerio");

class VoteLeaderboard {
  async getLeaderboard() {
    try {
      const response = await axios.get(`https://www.pika-network.net/vote/`);
      const responseBody = response.data;
      const $ = cheerio.load(responseBody);

      const leaderboard = [];

      $(".contentRow")
        .slice(0, 10)
        .each((index, element) => {
          const username = $(element).find(".username").text().trim();
          const value = $(element).find(".username").next().text().trim();
          console.log(username);
          leaderboard.push({ position: index + 1, username, value });
        });

      return leaderboard;
    } catch (error) {
      console.error("An error occurred:", error);
      return [];
    }
  }
}

module.exports = VoteLeaderboard;
