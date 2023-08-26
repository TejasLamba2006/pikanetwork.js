const { TotalLeaderboard } = require("../src/index.js");

async function fetchTotalLeaderboard() {
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
  try {
    const leaderboard = await totalLeaderboard.fetchLeaderboardData(); // Get the total leaderboard based on set parameters.
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchTotalLeaderboard();
