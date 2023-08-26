const axios = require("axios");
const cheerio = require("cheerio");

class Forum {
  constructor() {
    this.baseUrl = "https://www.pika-network.net/online/";
  }

  async getOnlineMembers() {
    const allUsernamesSet = new Set();
    let page = 1;

    while (true) {
      try {
        const url = this.baseUrl + `?type=member&page=${page}`;
        const response = await axios.get(url);
        const responseBody = response.data;
        const $ = cheerio.load(responseBody);

        const usernames = $(".username")
          .map((index, element) => $(element).text().trim())
          .get();

        if (usernames.length === 0) {
          break;
        }

        usernames.forEach(username => allUsernamesSet.add(username));

        const hasNextPageButton = $(".pageNav-jump--next").length > 0;
        const hasPrevPageButton = $(".pageNav-jump--prev").length > 0;

        if (!hasNextPageButton && hasPrevPageButton) {
          break;
        }

        page++;
      } catch (error) {
        console.error("An error occurred:", error);
        break;
      }
    }

    return Array.from(allUsernamesSet);
  }

  async getLeaderboard(type) {
    try {
      const key =
        type === "points"
          ? "most_points_custom"
          : type === "reactionScore"
          ? "highest_reaction_score_custom"
          : type === "messages"
          ? "most_messages_custom"
          : null;

      const response = await axios.get(`https://www.pika-network.net/members/?key=${key}`);
      const responseBody = response.data;
      const $ = cheerio.load(responseBody);

      const leaderboard = [];

      $(".contentRow").each((index, element) => {
        const username = $(element).find(".username").text().trim();
        const valueString = $(element).find(".contentRow-extra--largest").text().trim();
        const value = parseInt(valueString.replace(/,/g, ""), 10);
        leaderboard.push({ position: index + 1, username, value });
      });

      return leaderboard;
    } catch (error) {
      console.error("An error occurred:", error);
      return [];
    }
  }
}

module.exports = Forum;
