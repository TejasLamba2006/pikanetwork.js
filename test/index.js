const { TotalLeaderboard } = require("../src/index.js");
const { PlayerLeaderboard } = require("../src/index.js");

async function fetchLeaderboard() {
  const playerIGN = "PikaNetwork";
  const interval = "total"; // total, monthly, weekly.
  const mode = "ALL_MODES"; // ALL_MODES, SOLO, DOUBLES, TRIPLES, QUAD.
  const stat = "wins"; // Too many to be listed (varies from game to game).
  const gamemode = "bedwars";
  // bedwars, skywars, rankedpractice, unrankedpractice, kitpvp,
  // classicskyblock, survival, lifesteal, opskyblock, oplifesteal
  // opfactions, opprison. These are all options for gamemode.
  const offset = "0";
  const limit = "25";
  // The offset is at which postion the leaderboard starts (0 = #1 is the first).
  // The limit is upto how many players will be shown, the limit is capped at 25.
  const totalLeaderboard = new TotalLeaderboard(interval, mode, stat, offset, limit, gamemode);
  const playerLeaderboard = new PlayerLeaderboard(playerIGN, interval, mode, gamemode);
  try {
    const tLeaderboard = await totalLeaderboard.fetchLeaderboardData(); // Get the total leaderboard based on set parameters.
    const pLeaderboard = await playerLeaderboard.getLeaderboardData(); // Get the player's leaderboard based on set parameters.
    const pKDR = await playerLeaderboard.getKDR(); // Get the player's kill/death ratio.
    const pFKDR = await playerLeaderboard.getFKDR(); // Get the player's final kill/final death ratio.
    const pWLR = await playerLeaderboard.getWLR(); // Get the player's win/loss ratio.
    console.log(tLeaderboard);
    console.log(pLeaderboard);
    console.log(pKDR);
    console.log(pFKDR);
    console.log(pWLR);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchLeaderboard();
