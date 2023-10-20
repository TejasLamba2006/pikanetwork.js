// PikaNetwork API
const Profile = require("./endpoints/api/profile.js");
const PlayerLeaderboard = require("./endpoints/api/playerLeaderboard.js");
const TotalLeaderboard = require("./endpoints/api/totalLeaderboard.js");

// PikaNetwork Forums
const Forum = require("./endpoints/forum/forum.js");
const Punishments = require("./endpoints/forum/punishments.js");
const Staff = require("./endpoints/forum/staff.js");
const Store = require("./endpoints/forum/store.js");
const VoteLeaderboard = require("./endpoints/forum/voteLeaderboard.js");
const Account = require("./endpoints/login/mainClass.js");

// PikaNetwork Discord
const Discord = require("./endpoints/discord/discord.js");

// PikaNetwork Server
const Guild = require("./endpoints/minecraft/guild.js");

// External APIs
const Server = require("./endpoints/external/server.js");

module.exports = {
  Profile,
  PlayerLeaderboard,
  TotalLeaderboard,
  Forum,
  Punishments,
  Staff,
  Store,
  VoteLeaderboard,
  Discord,
  Guild,
  Server,
  Account,
};
