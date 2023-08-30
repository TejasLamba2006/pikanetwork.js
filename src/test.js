const { Punishments } = require("./index.js");

async function fetchPunishments() {
  const playerIGN = "Alparo_";
  const filter = "ban"; // warn, mute, kick, ban
  const consoleFilter = false; // true = on, false = off
  const page = 1; // Page no. of all punishments
  const punishment = new Punishments(playerIGN);

  try {
    const allPunishments = await punishment.getAllPunishments(filter, page, consoleFilter); // Get a list of global punishments.
    const playerPunishments = await punishment.getPunishments(filter, consoleFilter); // Get a list of the player's punishments.
    const issuedPunishments = await punishment.getIssuedPunishments(filter); // Get a list of punishments this staff has issued.
    console.log(playerPunishments);
  } catch (error) {
    console.error("Error fetching punishments:", error);
  }
}

fetchPunishments();
