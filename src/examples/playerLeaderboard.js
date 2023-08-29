const { PlayerLeaderboard } = require("pikanetwork.js");

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
    const ratio = await playerLeaderboard.getRatioData(); // Get the player's ratio stats.
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchPlayerLeaderboard();
