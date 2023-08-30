const { Punishments } = require("./index.js");

async function fetchPunishments() {
  const playerIGN = "Alparo_";
  const filter = "ban"; // warn, mute, kick, ban
  const consoleFilter = false; // true = on, false = off
  const page = 1; // Page no. of all punishments
  const punishment = new Punishments(playerIGN);

  try {
    const allPunishments = await punishment.getAllPunishments(filter, page, consoleFilter);
    const playerPunishments = await punishment.getPunishments(filter, consoleFilter);
    const issuedPunishments = await punishment.getIssuedPunishments(filter);
    console.log(playerPunishments);
  } catch (error) {
    console.error("Error fetching punishments:", error);
  }
}

fetchPunishments();
