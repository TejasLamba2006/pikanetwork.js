const axios = require("axios");
const cheerio = require("cheerio");
const _ = require("lodash");
const config = require("../jsons/config.json");
const errorConfig = require("../jsons/error.json");

class Punishments {
  constructor(playerIGN) {
    this.playerIGN = playerIGN;
    this.baseUrl = "https://pika-network.net/bans/";
  }

  async fetchHtml(url) {
    try {
      const response = await axios.get(url);
      return this.handleSuccessResponse(response);
    } catch (error) {
      throw new Error(`${config.prefix} ${errorConfig.punishments}\n ${error}`);
    }
  }

  handleSuccessResponse(response) {
    if (response.status !== 200) {
      throw new Error(`${config.prefix} ${errorConfig.punishments}\n ${errorConfig.responseCode}`);
    }
    return response.data;
  }

  cleanReason(reason) {
    const minecraftRegex = /(?:^\s+|(&|§)([0-9A-Fa-f])\b|&e[0-9]?\s?|^\[VL[^\]]*\]|^\?\s*)/g;
    const formattingCodesRegex = /(§[0-9a-fk-or])|(&[0-9a-fk-or])/gi;
    const cleanedReason = reason.replace(minecraftRegex, '').replace(formattingCodesRegex, '');
    return cleanedReason || "N/A";
  }

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
      if (functionName == "getPunishments") {
        _.unset(ban, "player");
      } else if (functionName == "getIssuedPunishments") {
        _.unset(ban, "staff");
      }

      bans.push(ban);
    });

    return bans;
  }

  async commonFilterPunishments(punishments, filterParam, consoleParam, typeToRemove) {
    const validFilters = new Set(["warn", "kick", "ban", "mute"]);

    let filteredPunishments = _.clone(punishments);

    if (!consoleParam) {
      filteredPunishments = _.filter(
        filteredPunishments,
        punishment => !punishment.staff.toLowerCase().includes("console")
      );
    }

    if (filterParam !== null) {
      if (!validFilters.has(filterParam.toLowerCase())) {
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

  async getPunishments(filterParam = null, consoleParam = true) {
    const url = `${this.baseUrl}search/${this.playerIGN}/`;
    const html = await this.fetchHtml(url);
    const punishments = this.scrapePunishmentsData(html, "getPunishments", null);

    return this.commonFilterPunishments(punishments, filterParam, consoleParam, "player");
  }

  async getIssuedPunishments(filterParam = null) {
    const url = `${this.baseUrl}search/${this.playerIGN}/?filter=issued`;
    const html = await this.fetchHtml(url);
    const issuedPunishments = this.scrapePunishmentsData(html, "getIssuedPunishments", null);

    return this.commonFilterPunishments(issuedPunishments, filterParam, true, "staff");
  }

  async getAllPunishments(filterParam = "ban", pageParam = 1, includeConsoleParam = true) {
    const validFilters = new Set(["warn", "kick", "ban", "mute"]);
    const filterMap = {
      warn: "warnings",
      mute: "mutes",
      kick: "kicks",
      ban: "bans",
    };
    const rightFilter = filterMap[filterParam.toLowerCase()];

    if (!validFilters.has(filterParam.toLowerCase())) {
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
