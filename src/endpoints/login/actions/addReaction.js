const fetch = require("node-fetch");
const formConverter = require("../formConverter");
const handleResponse = require("../handleResponse");

const DEFAULT_FORM = {
  reaction_id: "",
  _xfInlineEdit: "1",
  _xfToken: "",
  _xfWithData: 1,
  _xfResponseType: "json",
};

const REACTION_IDS = [
  1, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 28, 29, 30, 31, 32,
  33,
];

async function addReaction({ message, reaction_id }, cookies, Message) {
  if (!message) throw new Error("Message not found");
  if (!("message_id" in message)) throw new Error("the message must be a Message instance");
  if (!REACTION_IDS.includes(reaction_id))
    throw new Error("reaction_id must be a one of " + REACTION_IDS.join(", "));

  let form = { ...DEFAULT_FORM };
  form.reaction_id = reaction_id;
  form._xfToken = cookies.get("_xfToken");
  form = formConverter(Object.entries(form), true);

  const response = await fetch(
    `https://jartexnetwork.com/${message.type === "post" ? "posts" : "conversations/messages"}/${
      message.message_id
    }/react`,
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
      content: message.content,
      author: message.author,
      createdOn: message.createdOn,
      message_id: message.message_id,
      type: message.type,
    },
    cookies
  );
}

module.exports = addReaction;
