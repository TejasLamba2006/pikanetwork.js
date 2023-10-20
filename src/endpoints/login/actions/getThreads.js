const fetch = require("node-fetch")
const { parse } = require("node-html-parser")

const TYPES = {
  news: 5,
  "rules-information": 23,
  events: 148,
  "immortal-factions": 11,
  skyblock: 8,
  survival: 172,
  prison: 7,
  kitpvp: 6,
  creative: 28,
  practicepvp: 67,
  minigames: 173,
  "community-assistance": 90,
  suggestions: 22,
  "map-submissions": 157,
  "password-reset": 71,
  "payment-issues": 86,
  applications: 45,
  "player-introductions": 42,
  "server-discussion": 44,
  "staff-feedback": 175,
  "off-topic": 43,
  "youtube-showcase": 99,
}

async function getThreads({ page = 1, type }, cookies) {
  if (!(type in TYPES)) throw new Error("Type must be one of [" + Object.keys(TYPES).join(", ") + "]")
  if (isNaN(page)) throw new Error("Page must be a number")

  const response = await fetch(`https://jartexnetwork.com/forums/${type}.${TYPES[type]}/page-${page}`, {
    headers: { cookie: cookies.toString() },
  })
  const doc = parse(await response.text())
  let threads = []
  doc.querySelectorAll(".structItem").forEach((el) => {
    if (el.classList._set.has("js-emptyThreadList")) return
    const author = { name: el.getAttribute("data-author"), id: Number(el.querySelector("a").getAttribute("data-user-id")) }
    const title = el.querySelector(".structItem-title a[data-xf-init='preview-tooltip']")
    const link = title.getAttribute("href")
    const info = el.querySelectorAll(".pairs--justified")
    let data = {}
    info.forEach((el) => {
      let a = el.childNodes[3].text.trim()
      data[el.childNodes[1].text.trim().toLowerCase()] = isNaN(a) ? a : Number(a)
    })
    const id = Number(link.match(/[0-9]+\/?/)?.[0].replace("/", ""))
    threads.push({
      author,
      title: title.text,
      url: title.getAttribute("href"),
      lastActivity: new Date(el.querySelector("time").getAttribute("datetime")),
      id: isNaN(id) ? null : id,
      info: data,
      type: isNaN(id) ? "specialThread" : "thread",
    })
  })
  return threads
}

module.exports = getThreads
