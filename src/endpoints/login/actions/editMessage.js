const fetch = require("node-fetch");
const formConverter = require("../formConverter");
const handleResponse = require("../handleResponse");

const DEFAULT_FORM = {
  message_html: "",
  _xfInlineEdit: "1",
  _xfToken: "",
  _xfWithData: 1,
  _xfResponseType: "json",
};

async function editMessage({ message, content }, cookies, Message) {
  if (!message) throw new Error("Message not found");
  if (!("message_id" in message)) throw new Error("the message must be a Message instance");
  if (!content || typeof content !== "string")
    throw new Error("content must be a string with length greater than 0");

  let form = { ...DEFAULT_FORM };
  form.message_html = content;
  form._xfToken = cookies.get("_xfToken");
  form = formConverter(Object.entries(form), true);

  const response = await fetch(
    `https://jartexnetwork.com/${message.type === "post" ? "posts" : "conversations/messages"}/${
      message.message_id
    }/edit`,
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

  return new Message(
    {
      content: content,
      author: message.author,
      createdOn: message.createdOn,
      message_id: message.message_id,
      type: message.type,
    },
    cookies
  );
}

module.exports = editMessage;
