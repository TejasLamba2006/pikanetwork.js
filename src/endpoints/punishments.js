const axios = require("axios");
const cheerio = require("cheerio");
const _ = require("lodash");
const config = require("../jsons/config.json");
const errorConfig = require("../jsons/error.json");

/**
 * The `Punishments` class is responsible for fetching and filtering punishment data from a website.
 * It provides methods to retrieve punishments for a specific player, punishments issued by a specific staff member,
 * and all punishments of a specific type. The class also includes utility methods for cleaning the reasons of punishments
 * and scraping the punishment data from the website.
 *
 * @class Punishments
 */
class Punishments {
  constructor(playerIGN) {
    this.playerIGN = playerIGN;
    this.baseUrl = "https://pika-network.net/bans/";
    this.validFilters = new Set(["warn", "kick", "ban", "mute"]);
    this.filterMap = {
      warn: "warnings",
      mute: "mutes",
      kick: "kicks",
      ban: "bans",
    };
  }

  /**
   * Fetches the HTML content from the specified URL.
   *
   * @param {string} url - The URL to fetch the HTML from.
   * @return {Promise} A promise that resolves with the response from the server.
   */
  async fetchHtml(url) {
    try {
      const response = await axios.get(url);
      return this.handleSuccessResponse(response);
    } catch (error) {
      throw new Error(`${config.prefix} ${errorConfig.punishments}\n ${error}`);
    }
  }

  /**
   * Handles the success response from the API.
   *
   * @param {Object} response - The response object from the API call.
   * @throws {Error} If the response status is not 200.
   * @returns {Object} The data from the response.
   */
  handleSuccessResponse(response) {
    if (response.status !== 200) {
      throw new Error(`${config.prefix} ${errorConfig.punishments}\n ${errorConfig.responseCode}`);
    }
    return response.data;
  }

  /**
   * Clean the given reason by removing Minecraft formatting codes and special characters.
   *
   * @param {string} reason - The reason to be cleaned.
   * @return {string} - The cleaned reason, or "N/A" if the reason is empty.
   */
  cleanReason(reason) {
    const minecraftRegex = /(?:^\s+|(&|§)([0-9A-Fa-f])\b|&e[0-9]?\s?|^\[VL[^\]]*\]|^\?\s*)/g;
    const formattingCodesRegex = /(§[0-9a-fk-or])|(&[0-9a-fk-or])/gi;
    const cleanedReason = reason.replace(minecraftRegex, "").replace(formattingCodesRegex, "");
    return cleanedReason || "N/A";
  }

  /**
   * Scrapes punishments data from the provided HTML.
   *
   * @param {string} html - The HTML to scrape data from.
   * @param {string} functionName - The name of the function.
   * @param {string} filterParam - The filter parameter.
   * @return {Array} The array of scraped punishments data.
   */
  scrapePunishmentsData(html, functionName, filterParam) {
    const bans = [];
    const $ = cheerio.load(html);

    $(".row").each((index, element) => {
      const $element = $(element);
      const type =
        functionName === "getAllPunishments"
          ? filterParam
          : $element.find(".td._type b").text().trim();
      const staff = $element.find(".td._staff").text().trim() || "N/A";
      const player = $element.find(".td._user").text().trim() || "N/A";
      const reason = $element.find(".td._reason").text().trim();
      const date = $element.find(".td._date").text().trim();
      const expires = $element.find(".td._expires").text().trim();
      const ban = {
        type,
        player,
        staff,
        reason: this.cleanReason(reason),
        date,
        expires,
      };
      if (functionName === "getPunishments") {
        _.unset(ban, "player");
      } else if (functionName === "getIssuedPunishments") {
        _.unset(ban, "staff");
      }
      bans.push(ban);
    });

    return bans;
  }

  /**
   * Filters an array of punishments based on the given filter parameters.
   *
   * @param {Array} punishments - The array of punishments to filter.
   * @param {string} filterParam - The filter parameter to apply to the punishments.
   * @param {boolean} consoleParam - Whether or not to filter punishments involving the console.
   * @param {string} typeToRemove - The type of punishment to remove from the filtered punishments.
   * @return {Array} The filtered array of punishments.
   */
  async commonFilterPunishments(punishments, filterParam, consoleParam, typeToRemove) {
    let filteredPunishments = _.clone(punishments);

    if (!consoleParam) {
      filteredPunishments = _.filter(
        filteredPunishments,
        punishment => !punishment.staff.toLowerCase().includes("console")
      );
    }

    if (filterParam !== null) {
      if (!this.validFilters.has(filterParam.toLowerCase())) {
        throw new Error(
          `${config.prefix} ${errorConfig.punishments}\n${errorConfig.invalidPunishmentParameterA} ${filterParam} ${errorConfig.invalidPunishmentParameterB}`
        );
      }

      filteredPunishments = _.filter(
        filteredPunishments,
        punishment => punishment.type.toLowerCase() === filterParam.toLowerCase()
      );
    }

    if (typeToRemove) {
      _.unset(filteredPunishments[0], typeToRemove);
    }

    return filteredPunishments;
  }

  /**
   * Retrieves the punishments data for a player.
   *
   * @param {type} filterParam - an optional parameter to filter the punishments data (default: null)
   * @param {boolean} consoleParam - a flag to determine whether to log the output to console (default: true)
   * @return {type} the filtered punishments data for the player
   */
  async getPunishments(filterParam = null, consoleParam = true) {
    const url = `${this.baseUrl}search/${this.playerIGN}/`;
    const html = await this.fetchHtml(url);
    const punishments = this.scrapePunishmentsData(html, "getPunishments", null);

    return this.commonFilterPunishments(punishments, filterParam, consoleParam, "player");
  }

  /**
   * Retrieves the issued punishments for the player.
   *
   * @param {any} filterParam - The filter parameter to apply to the punishments.
   * @return {Promise<any>} - A promise that resolves with the issued punishments.
   */
  async getIssuedPunishments(filterParam = null) {
    const url = `${this.baseUrl}search/${this.playerIGN}/?filter=issued`;
    const html = await this.fetchHtml(url);
    const issuedPunishments = this.scrapePunishmentsData(html, "getIssuedPunishments", null);

    return this.commonFilterPunishments(issuedPunishments, filterParam, true, "staff");
  }

  /**
   * Retrieves all punishments based on the specified filter, page, and include console parameters.
   *
   * @param {string} filterParam - The filter parameter to determine the type of punishments to retrieve. Default is "ban".
   * @param {number} pageParam - The page parameter to specify the page number of results to retrieve. Default is 1.
   * @param {boolean} includeConsoleParam - The include console parameter to determine whether to include console punishments. Default is true.
   * @throws {Error} If the filter parameter is invalid.
   * @throws {Error} If the page parameter is invalid.
   * @return {Promise<Array>} An array of punishments based on the specified filter, page, and include console parameters.
   */
  async getAllPunishments(filterParam = "ban", pageParam = 1, includeConsoleParam = true) {
    const rightFilter = this.filterMap[filterParam.toLowerCase()];

    if (!this.validFilters.has(filterParam.toLowerCase())) {
      throw new Error(
        `${config.prefix} ${errorConfig.punishments}\n${errorConfig.invalidPunishmentParameterA} ${filterParam} ${errorConfig.invalidPunishmentParameterB}`
      );
    }

    const maxPage = await this.getMaxPage(rightFilter);

    if (isNaN(pageParam) || pageParam <= 0 || pageParam > maxPage) {
      throw new Error(
        `${config.prefix} ${errorConfig.punishments}\n${errorConfig.invalidPageParameter}`
      );
    }

    const url = `${this.baseUrl}${rightFilter}/page/${pageParam}`;
    const html = await this.fetchHtml(url);
    const punishments = this.scrapePunishmentsData(html, "getAllPunishments", filterParam);

    return this.commonFilterPunishments(punishments, filterParam, includeConsoleParam);
  }

  /**
   * Retrieves the maximum page number based on the filter parameter.
   *
   * @param {string} filterParam - The filter parameter used to fetch the maximum page number.
   * @return {number} The maximum page number. If no page number is found, it returns 1.
   */
  async getMaxPage(filterParam) {
    const url = `${this.baseUrl}${filterParam}/page/1`;
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);
    const pageElements = $(".item.info").text();
    const pageNumbers = pageElements.match(/\d+/g);

    if (pageNumbers && pageNumbers.length > 0) {
      return _.max(pageNumbers.map(Number));
    }

    return 1;
  }
}

module.exports = Punishments;
