const { Server } = require("./index.js");

async function fetchServerData() {
  const server = new Server();
  try {
    const data = await server.getServerData("play.jartex.fun"); // Get information about the server.
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchServerData();
