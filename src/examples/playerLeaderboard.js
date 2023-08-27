const { PlayerLeaderboard } = require("../src/index.js");

async function fetchPlayerLeaderboard() {
  const playerIGN = "PikaNetwork";
  const interval = "total"; // total, monthly, weekly.
  const mode = "ALL_MODES"; // ALL_MODES, SOLO, DOUBLES, TRIPLES, QUAD.
  const gamemode = "bedwars";
  // bedwars, skywars, rankedpractice, unrankedpractice, kitpvp,
  // classicskyblock, survival, lifesteal, opskyblock, oplifesteal
  // opfactions, opprison. These are all options for gamemode.
  const playerLeaderboard = new PlayerLeaderboard(playerIGN, interval, mode, gamemode);

  try {
    const leaderboard = await playerLeaderboard.getLeaderboardData(); // Get the player's leaderboard based on set parameters.
    const kdr = await playerLeaderboard.getKDR(); // Get the player's kill/death ratio.
    const fkdr = await playerLeaderboard.getFKDR(); // Get the player's final kill/final death ratio.
    const wlr = await playerLeaderboard.getWLR(); // Get the player's win/loss ratio.
    console.log(`Leaderboard: \n${leaderboard}`);
    console.log(`KDR: ${kdr}\nFKDR: ${fkdr}\nWLR: ${wlr}`);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchPlayerLeaderboard();
