const axios = require("axios");
const cheerio = require("cheerio");
const config = require("../jsons/config.json");
const errorConfig = require("../jsons/error.json");

class VoteLeaderboard {
  /**
   * Represents a voting leaderboard on a website.
   * @constructor
   */
  constructor() {
    /**
     * The URL of the voting leaderboard website.
     * @type {string}
     */
    this.url = "https://www.pika-network.net/vote";
  }

  /**
   * Parses the HTML element representing a voter and extracts the position, username, and votes.
   * @param {Object} element - The HTML element representing a voter.
   * @returns {Object} - The parsed voter data.
   */
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

  /**
   * Parses the HTML response and extracts the leaderboard data based on the provided selector.
   * @param {string} html - The HTML response.
   * @param {string} selector - The selector to extract the leaderboard data.
   * @returns {Array} - The parsed leaderboard data.
   */
  async parseLeaderboard(html, selector) {
    const $ = cheerio.load(html);
    const leaderboard = [];

    $(selector).each((index, element) => {
      leaderboard.push(this.parseVoterData($(element)));
    });

    return leaderboard;
  }

  /**
   * Fetches the leaderboard data from the website, parses it, and returns it in a structured format.
   * @returns {Object} - The leaderboard data.
   * @throws {Error} - If there is an error fetching or parsing the leaderboard data.
   */
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
