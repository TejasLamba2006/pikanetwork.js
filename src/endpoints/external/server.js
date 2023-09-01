const axios = require("axios");
const dns = require("dns");
const config = require("../../jsons/config.json");
const errorConfig = require("../../jsons/error.json");

const axiosInstance = axios.create();
const defaultApiUrl = "https://api.mcstatus.io/v2/status/java/play.pika-network.net";

class Server {
  /**
   * A class responsible for retrieving data about a Minecraft server.
   */
  constructor() {
    /**
     * An instance of the Axios library used for making HTTP requests.
     * @type {AxiosInstance}
     */
    this.axiosInstance = axios.create();

    /**
     * The default API URL for retrieving server data.
     * @type {string}
     */
    this.defaultApiUrl = "https://api.mcstatus.io/v2/status/java/";

    /**
     * An object containing configuration data loaded from a JSON file.
     * @type {object}
     */
    this.config = {};

    /**
     * An object containing error message configurations loaded from a JSON file.
     * @type {object}
     */
    this.errorConfig = {};
  }

  /**
   * Resolves the domain name of the server to its IP address.
   * @param {string} domain - The domain name of the server.
   * @returns {Promise<string>} A promise that resolves to the IP address of the domain.
   * @throws {Error} If an error occurs or no IP address is found.
   */
  async getIPAddress(domain) {
    return new Promise((resolve, reject) => {
      dns.resolve4(domain, (err, addresses) => {
        if (err) {
          reject(err);
        } else if (addresses.length > 0) {
          resolve(addresses[0]);
        } else {
          reject(
            new Error(
              `${this.config.prefix} ${this.errorConfig.server}\n${this.errorConfig.noIPAddressFound}`
            )
          );
        }
      });
    });
  }

  /**
   * Retrieves various information about the server.
   * @param {string} [serverIP] - The server IP address. If not provided, uses the default API URL.
   * @returns {Promise<object>} A promise that resolves to an object containing server data.
   * @throws {Error} If any errors occur during the process.
   */
  async getServerData(serverIP) {
    const apiUrl = serverIP ? `${this.defaultApiUrl}${serverIP}` : this.defaultApiUrl;

    try {
      const response = await this.axiosInstance.get(apiUrl);
      const { host, online, players, version, motd, srv_record } = response.data;

      if (response.status !== 200) {
        throw new Error(
          `${this.config.prefix} ${this.errorConfig.server}\n ${this.errorConfig.responseCode}`
        );
      }

      const motdLines = motd.clean.split("\n").map(part => part.trim());
      const ip = await this.getIPAddress(host);
      const icon = `https://eu.mc-api.net/v3/server/favicon/${host}`;
      const banner = `https://api.loohpjames.com/serverbanner.png?ip=${host}`;

      const serverData = {
        host,
        ip,
        port,
        icon,
        banner,
        online,
        software: version.name_clean,
        protocol: version.protocol,
        players_online: players.online,
        players_max: players.max,
        motd: motdLines,
        srv_record,
      };

      if (host === "play.pika-network.net") {
        serverData.website = "https://pika-network.net/";
        serverData.discord = "https://discord.gg/pikanetwork";
      }

      return serverData;
    } catch (error) {
      throw new Error(`${this.config.prefix} ${this.errorConfig.server}\n${error}`);
    }
  }
}

module.exports = Server;
