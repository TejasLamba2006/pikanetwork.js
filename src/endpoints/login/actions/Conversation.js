const Thread = require("./Thread")
const invite2Conversation = require("./invite2Conversation")

class Conversation extends Thread {
  constructor(url, cookies) {
    if (typeof url === "number") {
      super(`https://jartexnetwork.com/conversations/test_.${url}/`, cookies)
    } else {
      super(url, cookies)
    }
  }

  async fetch() {
    await this._cookies.update("https://jartexnetwork.com/conversations/")

    const document = await super.fetch()

    // Participants
    this.participants = []
    document.querySelectorAll(".contentRow .username").forEach((el) => {
      this.participants.push({
        name: el.text,
        id: Number(el.getAttribute("data-user-id")),
      })
    })

    // conversation info
    this.info = {}
    document.querySelectorAll(".p-body-sidebar .pairs.pairs--justified")?.forEach((el) => {
      let key = el.childNodes?.[0]?.text.trim().toLowerCase().replace(/ /g, "_")
      let value = el.childNodes?.[2]
      if (!value) return
      if (value.childNodes?.[0]?.rawTagName === "time") value = new Date(value.childNodes[0].getAttribute("datetime"))
      else {
        value = value.text.trim()
        if (!isNaN(Number(value))) value = Number(value)
      }
      if (key && value) this.info[key] = value
    })
  }

  async invite(recipients) {
    await invite2Conversation({ url: this.url, recipients }, this._cookies)
  }
}

module.exports = Conversation
