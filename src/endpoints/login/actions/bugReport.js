const fetch = require("node-fetch")
const formConverter = require("../formConverter")
const handleResponse = require("../handleResponse")

const GAMEMODES = {
  "Immortal Factions": 14,
  Survival: 143,
  SBF: 17,
  SBD: 16,
  Prison: 31,
  Creative: 21,
  KitPvP: 19,
  PracticePvP: 46,
  Minigames: 111,
  SkyWars: 18,
  BedWars: 45,
  TheBridge: 119,
  Discord: 94,
  Forums: 23,
  Global: 95,
  Lobby: 13,
  Store: 93,
  Other: 24,
}

const DEFAULT_FORM = {
  "question[14]": "", //MC name
  "question[166]": "", // MC version
  "question[167]": "", // bug
  "question[168]": "", // bug description
  "question[169]": "", //steps
  "question[172]": 2, //screenshot? 1 = yes, 2 = no
  "question[170]": "", //extra inforamtion
  "question[174][]": 16, // gamemodes
  _xfToken: "",
  _xfWithData: 1,
  _xfResponseType: "json",
}

async function bugReport(args, cookies) {
  ;["username", "mcVersion", "bug", "bug_description", "steps"].forEach((key) => {
    if (!(key in args)) throw new Error(`${key} is required`)
  })
  let { username, mcVersion, bug, bug_description, steps, extra_information = "", gamemodes, screenshot = false } = args
  if (!Array.isArray(gamemodes)) throw new Error("gamemodes must be an array")
  if (!gamemodes.every((gm) => gm in GAMEMODES)) throw new Error("gamemode must be one of [" + Object.keys(gamemodes).join(", ") + "]")
  let form = { ...DEFAULT_FORM }
  form["question[14]"] = username
  form["question[166]"] = mcVersion
  form["question[167]"] = bug
  form["question[168]"] = bug_description
  form["question[169]"] = steps
  form["question[170]"] = extra_information
  form["question[172]"] = screenshot ? 1 : 2
  form["question[174][]"] = gamemodes.map((g) => GAMEMODES[g]).join(", ")
  form._xfToken = cookies.get("_xfToken")
  form = formConverter(Object.entries(form), true)

  const response = await fetch("https://jartexnetwork.com/form/bug-report.16/submit", {
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
module.exports = bugReport
