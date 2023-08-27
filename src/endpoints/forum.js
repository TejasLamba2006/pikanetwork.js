const axios = require("axios");
const cheerio = require("cheerio");
const config = require("../jsons/config.json");
const errorConfig = require("../jsons/error.json");

class Forum {
  constructor() {
    this.baseURL = "https://www.pika-network.net";
  }

  async fetchData(url) {
    try {
      const response = await axios.get(url);
      if (response.status !== 200) {
        console.error(`${config.prefix} ${errorConfig.forum}\n ${errorConfig.responseCode}`);
      }
      return response.data;
    } catch (error) {
      console.error(`${config.prefix} ${errorConfig.forum}\n ${error}`);
      return null;
    }
  }

  async getOnlineMembers() {
    const allUsernamesSet = new Set();
    let page = 1;

    try {
      while (true) {
        const url = `${this.baseURL}/online/?type=member&page=${page}`;
        const data = await this.fetchData(url);
        if (!data) break;

        const $ = cheerio.load(data);

        const usernames = $(".username")
          .map((_, element) => $(element).text().trim())
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
      console.error(`${config.prefix} ${errorConfig.forum}\n ${error}`);
    }

    return Array.from(allUsernamesSet);
  }

  async getForumStatistics() {
    try {
      const data = await this.fetchData(`${this.baseURL}/forums/`);
      if (!data) return {};

      const $ = cheerio.load(data);

      const usersCountFormatted = parseInt($(".count--users").text().replace(/\D/g, ""), 10);
      const messagesCount = parseInt($(".count--messages dd").text()?.replace(/,/g, ""), 10);
      const threadsCount = parseInt($(".count--threads dd").text()?.replace(/,/g, ""), 10);

      return {
        users: usersCountFormatted,
        messages: messagesCount,
        threads: threadsCount,
      };
    } catch (error) {
      console.error(`${config.prefix} ${errorConfig.forum}\n ${error}`);
      return {};
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
        console.error(
          `${config.prefix} ${errorConfig.forum}\n ${errorConfig.invalidLeaderboardType}`
        );
        return [];
      }

      const data = await this.fetchData(`${this.baseURL}/members/?key=${key}`);
      if (!data) return [];

      const $ = cheerio.load(data);

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
      console.error(`${config.prefix} ${errorConfig.forum}\n ${error}`);
      return [];
    }
  }
}

module.exports = Forum;
