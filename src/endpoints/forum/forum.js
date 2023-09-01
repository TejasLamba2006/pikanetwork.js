/**
 * The `Forum` class is responsible for fetching data from the PikaNetwork forums website and providing various functionalities related to the forums, such as retrieving online members, forum statistics, and leaderboard information.
 *
 * @class
 * @name Forum
 *
 * @example
 * const forum = new Forum();
 * const statistics = await forum.getForumStatistics();
 * const onlineMembers = await forum.getOnlineMembers();
 * const leaderboard = await forum.getLeaderboard(type);
 */
const axios = require("axios");
const cheerio = require("cheerio");
const config = require("../../jsons/config.json");
const errorConfig = require("../../jsons/error.json");

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

  /**
   * Retrieves a list of all online forum members.
   *
   * @returns {Array} An array containing the usernames of all online forum members.
   */
  async getOnlineMembers() {
    const allUsernamesSet = new Set();
    let page = 1;

    try {
      const hasNextPageButtonSelector = ".pageNav-jump--next";
      const hasPrevPageButtonSelector = ".pageNav-jump--prev";

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

        const hasNextPageButton = $(hasNextPageButtonSelector).length > 0;
        const hasPrevPageButton = $(hasPrevPageButtonSelector).length > 0;

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

  /**
   * Retrieves the certain statistics from the forums.
   *
   * @return {Object} An object containing the number of total users, messages, and threads in the forums.
   */
  async getForumStatistics() {
    try {
      const data = await this.fetchData(`${this.baseURL}/forums/`);
      if (!data) return {};

      const $ = cheerio.load(data);
      const usersCountFormatted = parseInt($(".count--users").text().replace(/\D/g, ""), 10);
      const messagesCount = parseInt($(".count--messages dd").text().replace(/\D/g, ""), 10);
      const threadsCount = parseInt($(".count--threads dd").text().replace(/\D/g, ""), 10);

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
  /**
   * Retrieves the forum leaderboards.
   *
   * @param {string} type - The leaderboard to scrape. Valid values are "points", "reactionScore", and "messages".
   * @return {Object} An object containing the forum leaderboards based on set parameters.
   */
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
      const contentRows = $(".contentRow").get();
      const leaderboard = [];

      for (let index = 0; index < contentRows.length; index++) {
        const element = contentRows[index];
        const username = $(element).find(".username").text().trim();
        const valueString = $(element).find(".contentRow-extra--largest").text().trim();
        const value = parseInt(valueString.replace(/,/g, ""), 10);
        leaderboard.push({ position: index + 1, username, value });
      }

      return leaderboard;
    } catch (error) {
      console.error(`${config.prefix} ${errorConfig.forum}\n ${error}`);
      return [];
    }
  }
}

module.exports = Forum;
