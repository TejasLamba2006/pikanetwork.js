const axios = require("axios");
const config = require("../jsons/config.json");
const errorConfig = require("../jsons/error.json");

class Server {
  constructor() {
    this.apiUrl = "https://api.mcstatus.io/v2/status/java/play.pika-network.net";
  }

  async getServerData() {
    try {
      const serverResponse = await axios.get(this.apiUrl);

      if (serverResponse.status !== 200) {
        throw new Error(`${config.prefix} ${errorConfig.server}\n${errorConfig.responseCode}`);
      }

      const serverData = serverResponse.data;
      const version = serverData.version;
      const motdLines = serverData.motd.clean.split("\n").map(part => part.trim());

      return {
        host: serverData.host,
        ip: "51.178.244.42",
        port: serverData.port,
        online: serverData.online,
        software: version.name_clean,
        protocol: version.protocol,
        players_online: serverData.players.online,
        players_max: serverData.players.max,
        motd: motdLines,
        srv_record: serverData.srv_record,
      };
    } catch (error) {
      console.error(`\n${config.prefix} ${errorConfig.server}\n${error}`);
    }
  }
}

module.exports = Server;
