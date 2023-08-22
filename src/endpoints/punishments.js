const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * A class for scraping ban data from a Pika Network bans search page.
 */
class PikaBansScraper {
  /**
   * Creates an instance of PikaBansScraper.
   * @param {string} playerIGN - The player's in-game name (IGN).
   */
  constructor(playerIGN) {
    this.playerIGN = playerIGN;
    this.baseUrl = 'https://pika-network.net/bans/search/';
  }

  /**
   * Scrapes ban data from the given HTML content.
   * @param {string} html - The HTML content to scrape.
   * @returns {Array} - An array of ban objects.
   */
  static scrapeBanData(html) {
    let bans = [];
    const $ = cheerio.load(html);
    
    $('.row').each((index, element) => {
      const ban = {};

      ban.type = $(element).find('.td._type b').text().trim();
      ban.staff = $(element).find('.td._staff').text().trim();
      ban.reason = $(element).find('.td._reason').text().trim();
      ban.date = $(element).find('.td._date').text().trim();
      ban.expires = $(element).find('.td._expires').text().trim();

      bans.push(ban);
    });

    return bans;
  }

  /**
   * Fetches and scrapes ban data for the player.
   * @returns {Promise<Array>} - An array of ban objects.
   */
  async getBans() {
    const url = `${this.baseUrl}${this.playerIGN}/`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`[pikanetwork.js] Failed to fetch ban data. Status code: ${response.status}`)
        throw new Error('[pikanetwork.js] Failed to fetch ban data.');
      }
      const html = await response.text();
      const bans = PikaBansScraper.scrapeBanData(html);
      return bans;
    } catch (error) {
      console.error(`[pikanetwork.js] An error occurred while fetching or parsing ban data. ${error}`);
      throw new Error('[pikanetwork.js] An error occurred while fetching or parsing ban data.');
    }
  }
}
module.exports = PikaBansScraper;
