const { VoteLeaderboard } = require("pikanetwork.js");

async function fetchVoteLeaderboard() {
  const voteLeaderboard = new VoteLeaderboard();
  try {
    const leaderboard = await voteLeaderboard.getLeaderboard(); // Get the vote leaderboard.
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchVoteLeaderboard();
