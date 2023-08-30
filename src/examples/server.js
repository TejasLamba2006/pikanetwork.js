const { Server } = require("pikanetwork.js");

async function fetchServerData() {
  const server = new Server();
  try {
    const data = await server.getServerData(); // Get information about the server.
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchServerData();
