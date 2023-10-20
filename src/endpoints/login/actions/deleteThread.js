const fetch = require("node-fetch");
const formConverter = require("../formConverter");
const handleResponse = require("../handleResponse");
const Thread = require("./Thread");

const DEFAULT_FORM = {
  reason: "",
  hard_delete: 0,
  _xfWithData: 1,
  _xfToken: "",
  _xfResponseType: "json",
};

async function deleteThread({ url, reason = "" }, cookies) {
  if (!url) throw new Error("Message is required");

  let form = { ...DEFAULT_FORM };
  form.reason = reason;
  form._xfToken = cookies.get("_xfToken");

  form = formConverter(Object.entries(form), true);

  const response = await fetch(`${url}${url.endsWith("/") ? "" : "/"}delete`, {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "content-type": "multipart/form-data; boundary=----WebKitFormBoundary",
      cookie: cookies.toString(),
    },
    body: form,
    method: "POST",
  });
  await handleResponse(response);
}

module.exports = deleteThread;
