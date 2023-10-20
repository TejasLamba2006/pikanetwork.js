const fetch = require("node-fetch")
const formConverter = require("../formConverter")
const handleResponse = require("../handleResponse")
const Thread = require("./Thread")

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

const DEFAULT_FORM = {
  title: "Are you smart enough?",
  discussion_type: "discussion",
  message_html: "",
  watch_thread: 1,
  watch_thread_email: 1,
  "_xfSet[watch_thread]": 1,
  _xfWithData: 1,
  _xfToken: "",
  _xfResponseType: "json",
}

async function createThread({ message, title, type, discussion_type = "discussion" }, cookies) {
  if (!message) throw new Error("Message is required")
  if (!title) throw new Error("Title is required")
  if (!(type in TYPES)) throw new Error("Type must be one of [" + Object.keys(TYPES).join(", ") + "]")

  let form = { ...DEFAULT_FORM }
  form.title = title
  form.message_html = `<p>${message}</p>`
  form.discussion_type = discussion_type

  form._xfToken = cookies.get("_xfToken")

  form = formConverter(Object.entries(form), true)

  const response = await fetch(`https://jartexnetwork.com/forums/${type}.${TYPES[type]}/post-thread`, {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "content-type": "multipart/form-data; boundary=----WebKitFormBoundary",
      cookie: cookies.toString(),
    },
    body: form,
    method: "POST",
  })
  const data = await handleResponse(response)
  const url = data.redirect
  if (!url) throw new Error("Failed to create thread")

  return new Thread(url, cookies)
}

module.exports = createThread
