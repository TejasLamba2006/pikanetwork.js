const axios = require("axios");
const config = require("../config.json");

class Server {
  constructor() {
    this.apiUrl = "https://api.mcstatus.io/v2/status/java/play.pika-network.net";
  }

  async getServerData() {
    try {
      const serverResponse = await axios.get(this.apiUrl);

      if (serverResponse.status !== 200) {
        throw new Error(
          `${config.prefix} Failed to fetch server data from the API. Status code: ${serverResponse.status}`
        );
      }

      const serverData = serverResponse.data;
      const version = serverData.version;
      const motdData = serverData.motd.clean;
      const motdLines = motdData.split("\n").map(part => part.trim());

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
      throw new Error(`${config.prefix} An error occurred while fetching data. ${error}`);
    }
  }
}

module.exports = Server;
