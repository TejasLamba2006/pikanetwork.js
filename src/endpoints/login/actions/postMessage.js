const formConverter = require("../formConverter");
const handleResponse = require("../handleResponse");
const fetch = require("node-fetch");
const Message = require("./Message");

const DEFAULT_FORM = {
  message_html: "<p>/p>",
  last_known_date: 0,
  load_extra: 1,
  _xfToken: "",
  _xfWithData: 1,
  _xfResponseType: "json",
};

async function postMessage({ content, url }, cookies) {
  if (typeof content !== "string") throw new Error("Content must be a string");
  if (!content) throw new Error("cannot send an empty message");
  if (!url) throw new Error("cannot send a message to a non-existent chat");
  let form = { ...DEFAULT_FORM };
  form.message_html = `<p>${content}</p>`;
  form._xfToken = cookies.get("_xfToken");

  const formData = formConverter(Object.entries(form), true);

  const response = await fetch(url + (url.endsWith("/") ? "" : "/") + "add-reply", {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "content-type": "multipart/form-data; boundary=----WebKitFormBoundary",
      cookie: cookies.toString(),
    },
    body: formData,
    method: "POST",
  });

  const data = await handleResponse(response);
  if (!data.redirect) return null;
  return new Message(
    {
      content: content,
      message_id: data.redirect.match(/[A-z]+\/[0-9]+\/?$/)?.[0],
      createdOn: new Date(),
      author: {
        name: cookies.account.username,
        avatar: cookies.account.avatar,
        id: cookies.account.id,
      },
    },
    cookies
  );
}

module.exports = postMessage;
