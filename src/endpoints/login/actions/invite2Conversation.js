const fetch = require("node-fetch")
const formConverter = require("../formConverter")
const handleResponse = require("../handleResponse")

const DEFAULT_FORM = {
  recipients: "",
  _xfToken: "",
  _xfWithData: 1,
  _xfResponseType: "json",
}

async function invite2Conversation({ recipients, url }, cookies) {
  if (!Array.isArray(recipients)) throw new Error("recipients must be an array")
  if (!recipients.length) throw new Error("recipients must be an array with at least one user")
  if (!recipients.every((e) => typeof e === "string")) throw new Error("recipients must be an array of strings")

  let form = { ...DEFAULT_FORM }
  form.recipients = recipients.join(", ")
  form._xfToken = cookies.get("_xfToken")
  form = formConverter(Object.entries(form), true)

  const response = await fetch(`${url}/invite`, {
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

module.exports = invite2Conversation
