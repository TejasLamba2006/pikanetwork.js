const { VoteLeaderboard } = require("../src/index.js");

async function fetchLeaderboard() {
  try {
    const forum = new VoteLeaderboard();
    const list = await forum.getLeaderboard();
    console.log(list);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchLeaderboard();
