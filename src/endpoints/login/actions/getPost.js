const fetch = require("node-fetch")
const Message = require("./Message")
const { parse } = require("node-html-parser")

async function getMessage({ id, type = "post" }, cookies) {
  if (typeof id !== "number") throw new Error("message id must be a number")
  const response = await fetch(`https://jartexnetwork.com/${type === "post" ? "post" : "conversations/messages"}/${id}`, { headers: { cookie: cookies.toString() } })
  const document = parse(await response.text())

  const el = document.getElementById(`${type === "post" ? "post" : "convMessage"}-${id}`)
  if (!el) throw new Error("Message not found")

  return new Message(el.parentNode, cookies)
}

module.exports = getMessage
