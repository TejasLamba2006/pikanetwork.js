const { Punishments } = require("../src/index.js");

async function fetchPunishments() {
  const playerIGN = "MrFrenco";
  const punishment = new Punishments(playerIGN);

  try {
    const punishments = await punishment.getPunishments(); // Get a list of all of the player's punishments.
    const issued = await punishment.getIssuedPunishments(); // Get a list of punishments issued by this player.
  } catch (error) {
    console.error("Error fetching punishments:", error);
  }
}

fetchPunishments();
