// const { Store } = require("./index.js");

// async function fetchstore() {
//   const store = new Store();

//   try {
//     const allstore = await store.getPanels();
//     console.log(allstore);
//   } catch (error) {
//     console.error("Error fetching store:", error);
//   }
// }

// fetchstore();

// /* const { Punishments } = require("./index.js");

// async function fetchPunishments() {
//   const playerIGN = "Alparo_";
//   const filter = "ban"; // warn, mute, kick, ban
//   const consoleFilter = true; // true = on, false = off
//   const page = 1; // Page no. of all punishments
//   const punishment = new Punishments(playerIGN);

//   try {
//     const allPunishments = await punishment.getAllPunishments(filter, page, consoleFilter); // Get a list of global punishments.
//     const playerPunishments = await punishment.getPunishments(filter, consoleFilter); // Get a list of the player's punishments.
//     const issuedPunishments = await punishment.getIssuedPunishments(filter); // Get a list of punishments this staff has issued.
//     console.log(issuedPunishments);
//   } catch (error) {
//     console.error("Error fetching punishments:", error);
//   }
// }

// fetchPunishments();
// **/

const { Account } = require("./index.js");

const account = new Account("tejas1794", "Tejas321@");
(async () => {
  await account.login();
  console.log(account.getCookies());
  await account.createGameplayReport({
    username: "test",
    gamebreaker: "test",
    rule: "test",
    gamemode: "BedWars",
    evidence: "test",
    extra_information: "test",
  });
})();
