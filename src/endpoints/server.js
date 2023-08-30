const axios = require("axios");
const dns = require("dns");
const config = require("../jsons/config.json");
const errorConfig = require("../jsons/error.json");

const axiosInstance = axios.create();
const defaultApiUrl = "https://api.mcstatus.io/v2/status/java/play.pika-network.net";

class Server {
  async getIPAddress(domain) {
    return new Promise((resolve, reject) => {
      dns.resolve4(domain, (err, addresses) => {
        if (err) {
          reject(err);
        } else if (addresses.length > 0) {
          resolve(addresses[0]);
        } else {
          reject(new Error(`${config.prefix} ${errorConfig.server}\n${errorConfig.noIPAddressFound}`));
        }
      });
    });
  }

  async getServerData(serverIP) {
    const apiUrl = serverIP ? `https://api.mcstatus.io/v2/status/java/${serverIP}` : defaultApiUrl;

    try {
      const response = await axiosInstance.get(apiUrl);
      const { host, online, players, version, motd, srv_record } = response.data;

      if (response.status !== 200) {
        throw new Error(`${config.prefix} ${errorConfig.server}\n ${errorConfig.responseCode}`);
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
      throw new Error(`${config.prefix} ${errorConfig.server}\n${error}`)
    }
  }
}

module.exports = Server;
