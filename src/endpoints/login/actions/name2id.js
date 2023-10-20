const fetch = require("node-fetch")
const { parse } = require("node-html-parser")
async function name2id(username = "", cookies) {
  if (username.length < 3) throw new Error("Invalid username")
  if (!cookies.get("_xfToken")) await cookies.update("https://jartexnetwork.com/staff/")
  const response = await fetch(`https://jartexnetwork.com/index.php?members/find&q=${username}&_xfToken=${cookies.get("_xfToken")}&_xfResponseType=json&_xfWithData=1`, {
    headers: { cookie: cookies.toString() },
  })
  try {
    const json = await response.json()
    if (json.results?.length === 0) {
      return null // == user not found
    }
    const user = json.results.find((e) => e.id.toLowerCase() === username.toLowerCase())
    if (!user) return null
    const doc = parse(user.iconHtml)
    return Number(doc.firstChild.getAttribute("data-user-id"))
  } catch (err) {
    console.log(err)
    throw new Error("Failed to get user")
  }
}

module.exports = name2id
