const fetch = require("node-fetch")
const formConverter = require("../formConverter")
const handleResponse = require("../handleResponse")

const RULES = {
  Capslock: "1",
  Spam: "2",
  Flood: "3",
  "Character Spam": "4",
  "Chat Trolling": "5",
  "Foreign Language": "6",
  "General Rudeness": "7",
  Ghosting: "8",
  "Light Advertising": "9",
  "Mini-Modding": "10",
  Swearing: "11",
  "Undefined Link": "12",
  "Selling / Buying Accounts": "13",
  "Selling / Buying in-game items for PayPal": "14",
  Rioting: "15",
  "Inappropriate Username": "16",
  "Inappropriate Behavior/Inappropriate Language": "17",
  "Swearing with a disease/disability": "18",
  Sexism: "19",
  "Inappropriate Links": "20",
  "Advertising Social Media": "21",
  "Mute Evading": "22",
  "Discrimination/Racism": "23",
  "Death Threats": "24",
  "Suicide Threats": "25",
  "Dox Threats": "26",
  "DDoS Threats": "27",
  Doxing: "28",
  DDoSing: "29",
  "Asking for nudes": "30",
  "Distributing nudes": "31",
  Advertising: "32",
  "Advertising Hacked Clients": "33",
  "Inappropriate Nickname": "34",
  "Player Impersonation": "35",
  "Staff Impersonation": "36",
  "YouTube/Twitch Impersonation": "37",
}

const GAMEMODES = {
  "Immortal Factions": "1",
  "SkyBlock Dream": "2",
  "SkyBlock Fantasy": "3",
  Prison: "4",
  Survival: "5",
  KitPvP: "6",
  Creative: "7",
  Practice: "8",
  Minigames: "9",
  Lobby: "10",
}

const DEFAULT_FORM = {
  "question[8]": "", // username
  "question[122]": "", //game breaker username
  "question[123]": "", // rule
  "question[124]": "", // gamemode
  "question[125]": "", //Evidence
  "question[126]": "", // extra information
  _xfWithData: 1,
  _xfToken: "",
  _xfResponseType: "json",
}

async function chatReport(options, cookies) {
  ;["username", "gamebreaker", "rule", "gamemode", "evidence"].forEach((key) => {
    if (!options[key]) throw new Error(`${key} is required`)
  })
  let { username, gamebreaker, rule, gamemode, evidence, extra_information = "" } = options
  if (!(gamemode in GAMEMODES)) throw new Error("gamemode must be one of [" + Object.keys(gamemodes).join(", ") + "]")
  if (!(rule in RULES)) throw new Error("rule must be one of [" + Object.keys(RULES).join(", ") + "]")

  let form = { ...DEFAULT_FORM }

  form["question[8]"] = username
  form["question[122]"] = gamebreaker
  form["question[123]"] = RULES[rule]
  form["question[124]"] = GAMEMODES[gamemode]
  form["question[125]"] = evidence
  form["question[126]"] = extra_information

  form._xfToken = cookies.get("_xfToken")
  form = formConverter(Object.entries(form), true)

  const response = await fetch("https://jartexnetwork.com/form/chat-reports.9/submit", {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "content-type": "multipart/form-data; boundary=----WebKitFormBoundary",
      cookie: cookies.toString(),
    },
    body: form,
    method: "POST",
  })

  await handleResponse(response)
}
module.exports = chatReport
