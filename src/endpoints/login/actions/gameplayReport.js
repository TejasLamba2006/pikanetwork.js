const fetch = require("node-fetch");
const formConverter = require("../formConverter");
const handleResponse = require("../handleResponse");

const RULES = {
  Camping: 1,
  "Inappropriate Faction/Gang/Clan Name": 2,
  "Inappropriate Island Name": 3,
  "Holding Saferooms": 4,
  "Cross Teaming": 47,
  "Teaming in Solo": 6,
  "Teaming with Hackers": 7,
  "Team Killing": 76,
  "Freezing MC (KitPvP)": 9,
  "Pearl Glitching (KitPvP)": 10,
  "Map Exploiting": 11,
  "Boosting (KitPvP/PracticePvP)": 12,
  "Bug Exploiting": 13,
  "Inappropriate Username": 14,
  "Inappropriate Buildings": 15,
  "Lag Machine": 16,
  Scamming: 72,
  "TP Trapping": 18,
  "TP Killing": 19,
  "Ban Evading": 38,
  "Banned Mod/Clients/Texture Packs": 21,
  "Inappropriate Skin/Cape": 22,
  Reach: 23,
  Killaura: 24,
  Criticals: 25,
  Aimbot: 26,
  AntiBlind: 27,
  "Anti Knockback": 28,
  AntiPotion: 29,
  AntiFall: 30,
  AutoArmor: 31,
  AutoBlock: 32,
  AutoClicker: 33,
  AutoFish: 34,
  AutoPot: 35,
  AutoSteal: 36,
  AutoSoup: 37,
  "Bed Nuker": 39,
  "Bitch Claiming": 40,
  "Bow Aimbot": 41,
  "Bunny Hop": 42,
  ChestESP: 43,
  ChestStealer: 44,
  "CIV Breaker": 45,
  ClickAura: 46,
  "Damage Indicators": 48,
  Derp: 49,
  Duping: 50,
  "Faction Rules": 51,
  FastBow: 52,
  FastBreak: 53,
  FastBuild: 54,
  FastEat: 55,
  FastFall: 56,
  FastLadder: 57,
  FastPlace: 58,
  FightBot: 59,
  Flight: 60,
  FlyHacks: 61,
  Glide: 62,
  "Griefing / Stealing": 63,
  "Inappropriate Skin": 64,
  Insiding: 65,
  Nuker: 66,
  Phase: 67,
  PlayerESP: 68,
  Printer: 69,
  SafeWalk: 70,
  Scaffold: 71,
  "Selling Account": 73,
  Sneak: 74,
  Spider: 75,
  "TP-Traping": 77,
  "TP-Killing": 78,
  Velocity: 79,
};

const GAMEMODES = {
  BedWars: 1,
  "Classic SkyBlock": 2,
  Factions: 3,
  "Kit-PvP": 4,
  Lifesteal: 5,
  Lobby: 6,
  "OP Factions": 7,
  "OP Lifesteal": 8,
  "OP Prison": 9,
  "OP SkyBlock": 10,
  Practice: 11,
  SkyWars: 12,
  Survival: 13,
};

const DEFAULT_FORM = {
  "question[244]": "", // username
  "question[111]": "", //game breaker username
  "question[106]": "", // rule
  "question[95]": 1, //report type
  "question[245]": "", // gamemode
  "question[105]": "", //Evidence
  "question[101]": "", // extra information
  "question[246]": "", // timestamp
  _xfWithData: 1,
  _xfToken: "",
  _xfResponseType: "json",
};

/**
 * Reports gameplay information to the server.
 *
 * @param {Object} options - The options for the gameplay report.
 * @param {string} options.username - The username of the player.
 * @param {string} options.gamebreaker - The gamebreaker of the player.
 * @param {string} options.rule - The rule of the game.
 * @param {string} options.gamemode - The gamemode being played.
 * @param {string} options.evidence - The evidence of the gameplay.
 * @param {string} [options.extra_information=""] - Extra information about the gameplay.
 * @param {Object} cookies - The cookies to be included in the request.
 * @return {Promise<void>} A promise that resolves when the gameplay report is submitted.
 */
async function gameplayReport (options, cookies) {
  ["username", "gamebreaker", "rule", "gamemode", "evidence"].forEach((key) => {
    if (!options[key]) throw new Error(`${ key } is required`);
  });
  const {
    username,
    gamebreaker,
    rule,
    gamemode,
    evidence,
    extra_information = "",
  } = options;
  if (!(gamemode in GAMEMODES))
    throw new Error(
      "gamemode must be one of [" + Object.keys(GAMEMODES).join(", ") + "]",
    );
  // if (!(rule in RULES))
  //   throw new Error("rule must be one of [" + Object.keys(RULES).join(", ") + "]");

  let form = { ...DEFAULT_FORM };
  form["question[104]"] = username;
  form["question[101]"] = gamebreaker;
  form["question[102]"] = rule;
  form["question[105]"] = GAMEMODES[gamemode];
  form["question[106]"] = evidence;
  form["question[108]"] = extra_information;

  form._xfToken = cookies.get("_xfToken");
  form = formConverter(Object.entries(form), true);
  const response = await fetch(
    "https://pika-network.net/form/player-report.9/submit",
    {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "content-type": "multipart/form-data; boundary=----WebKitFormBoundary",
        cookie: cookies.toString(),
      },
      body: form,
      method: "POST",
    },
  );

  await handleResponse(response);
}
module.exports = gameplayReport;
