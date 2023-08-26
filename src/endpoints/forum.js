const axios = require("axios");
const cheerio = require("cheerio");

class Forum {
  constructor() {
    this.mainUrl = "https://www.pika-network.net/forums/";
    this.baseUrl = "https://www.pika-network.net/online/";
  }

  async getOnlineMembers() {
    const allUsernamesSet = new Set();
    let page = 1;

    try {
      while (true) {
        const url = `${this.baseUrl}?type=member&page=${page}`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

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
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }

    return Array.from(allUsernamesSet);
  }

  async getForumStatistics() {
    try {
      const response = await axios.get(this.mainUrl);
      const $ = cheerio.load(response.data);

      const usersCountRaw = $(".count--users").text();
      const usersCountFormatted = parseInt(usersCountRaw.replace(/\D/g, ""), 10);
      const messagesCount = parseInt($(".count--messages dd").text()?.replace(/,/g, ""), 10);
      const threadsCount = parseInt($(".count--threads dd").text()?.replace(/,/g, ""), 10);

      return {
        users: usersCountFormatted,
        messages: messagesCount,
        threads: threadsCount,
      };
    } catch (error) {
      console.error("An error occurred:", error);
      return [];
    }
  }

  async getLeaderboard(type) {
    try {
      const keyMap = {
        points: "most_points_custom",
        reactionScore: "highest_reaction_score_custom",
        messages: "most_messages_custom",
      };

      const key = keyMap[type];
      if (!key) {
        throw new Error("Invalid leaderboard type");
      }

      const response = await axios.get(`https://www.pika-network.net/members/?key=${key}`);
      const $ = cheerio.load(response.data);

      const leaderboard = $(".contentRow")
        .map((index, element) => {
          const username = $(element).find(".username").text().trim();
          const valueString = $(element).find(".contentRow-extra--largest").text().trim();
          const value = parseInt(valueString.replace(/,/g, ""), 10);
          return { position: index + 1, username, value };
        })
        .get();

      return leaderboard;
    } catch (error) {
      console.error("An error occurred:", error);
      return [];
    }
  }
}

module.exports = Forum;
