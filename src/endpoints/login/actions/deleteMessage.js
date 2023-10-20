const fetch = require("node-fetch");
const formConverter = require("../formConverter");
const handleResponse = require("../handleResponse");

const DEFAULT_FORM = {
  reason: "",
  hard_delete: 0,
  _xfToken: "",
  _xfWithData: 1,
  _xfResponseType: "json",
};

async function deleteMessage({ message, reason = "" }, cookies) {
  if (!message) throw new Error("Message not found");
  if (!("message_id" in message)) throw new Error("the message must be a Message instance");
  if (message.type !== "post")
    throw new Error(`You cannot delete this type of message: ${message.type}`);

  let form = { ...DEFAULT_FORM };
  form.reason = reason;
  form._xfToken = cookies.get("_xfToken");
  form = formConverter(Object.entries(form), true);

  const response = await fetch(
    "https://jartexnetwork.com/posts/" + message.message_id + "/delete",
    {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "content-type": "multipart/form-data; boundary=----WebKitFormBoundary",
        cookie: cookies.toString(),
      },
      body: form,
      method: "POST",
    }
  );

  await handleResponse(response);
}

module.exports = deleteMessage;
