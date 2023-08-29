const { Forum } = require("pikanetwork.js");

async function fetchForum() {
  const type = "points"; // points, reactionScore, messages.
  try {
    const forum = new Forum();
    const statistics = await forum.getForumStatistics(); // Get forum statistics.
    const onlineMembers = await forum.getOnlineMembers(); // Get a list of all online members.
    const leaderboard = await forum.getLeaderboard(type); // Get the forum leaderboards data based on set parameters.
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchForum();
