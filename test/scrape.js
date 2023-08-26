const { Forum } = require("../src/index.js");

async function fetchLeaderboard() {
  try {
    const forum = new Forum();
    const list = await forum.getForumStatistics();
    console.log(list);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchLeaderboard();
