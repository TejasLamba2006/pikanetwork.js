const { Profile } = require("pikanetwork.js");

async function fetchProfile() {
  const playerIGN = "PikaNetwork";
  const profile = new Profile(playerIGN);

  try {
    const ranks = await profile.getRankInfo(); // Get information about the player's ranks.
    const levelling = await profile.getLevellingInfo(); // Get information about the player's network level and rank.
    const guild = await profile.getGuildInfo(); // Guild information about the player's guild.
    const friends = await profile.getFriendList(); // Get a list of friends the player has.
    const joinInfo = await profile.getJoinInfo(); // Get information about the player's estimated first join and last join.
    const miscInfo = await profile.getMiscInfo(); // Get other miscellaneous information.
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchProfile();
