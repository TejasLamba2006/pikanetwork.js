const fetch = require("node-fetch")
const { parse } = require("node-html-parser")
const TYPES = ["all", "bans", "kicks", "mutes", "warns", "issued"]

async function getRules(username, type = "all") {
  if (!username) throw new Error("Username is required")
  if (!TYPES.includes(type)) throw new Error("Type must be one of: " + TYPES.join(", "))
  const response = await fetch(`https://jartexnetwork.com/bans/search/${username}/?filter=${type}`)
  const document = parse(await response.text())
  if (!document.querySelector(".username")) return null // Player not found
  const received = Number(document.querySelector("small").text.replace(/[^0-9]/g, ""))
  let result = { received, punishments: [] }
  document.querySelectorAll(".row").forEach((el) => {
    const a = el.querySelector("._expires").text
    const e = new Date(a)
    result.punishments.push({
      type: el.querySelector(".ptype").text,
      staff: el.querySelector(".user-link").text.trim(),
      reason: el.querySelector("._reason").text,
      date: new Date(el.querySelector("._date").text),
      expires: isNaN(e) ? a : e,
    })
  })
  return result
}

module.exports = getRules
