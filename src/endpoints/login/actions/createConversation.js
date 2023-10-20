const fetch = require("node-fetch")
const formConverter = require("../formConverter")
const handleResponse = require("../handleResponse")
const Conversation = require("./Conversation")

const DEFAULT_FORM = {
  recipients: "",
  title: "",
  message_html: "<p></p>",
  _xfToken: "",
  _xfRequestUri: "/conversations/add",
  _xfWithData: 1,
  _xfResponseType: "json",
}

async function createConversation({ title, body, recipients, locked = false, open_invite = false }, cookies) {
  if (!title) throw new Error("title is required")
  if (!body) throw new Error("body is required")
  if (!recipients?.length) throw new Error("recipients is required")
  await cookies.update("https://jartexnetwork.com/conversations/add")

  let form = { ...DEFAULT_FORM }
  form.title = title
  form.message_html = `<p>${body}</p>`
  form._xfToken = cookies.get("_xfToken")
  form.recipients = recipients.join(", ")
  if (open_invite) form.open_invite = 1
  if (locked) form.conversation_locked = 1
  const formData = formConverter(Object.entries(form), true)

  const response = await fetch("https://jartexnetwork.com/conversations/add", {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "content-type": "multipart/form-data; boundary=----WebKitFormBoundary",
      cookie: cookies.toString(),
    },
    body: formData,
    method: "POST",
  })
  let data = await handleResponse(response)

  const conversation = new Conversation(data.redirect, cookies)
  await conversation.fetch()
  return conversation
}

module.exports = createConversation
