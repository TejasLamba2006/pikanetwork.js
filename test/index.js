const {Leaderboard} = require('../src/index.js');
  // Example usage
  const playerIGN = "B0kile_";
  const interval = "weekly";
  const mode = "ALL_MODES";
  const stat = "kills";
  const offset = 0;
  const limit = 15;
  const gamemode = "bedwars";
  
  const leaderboard = new Leaderboard(playerIGN, interval, mode, stat, offset, limit, gamemode);
  leaderboard.fetchLeaderboardData().then(data => {
    console.log(data);
  });
  