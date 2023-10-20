const deleteMessage = require("./deleteMessage")
const editMessage = require("./editMessage")
const addReaction = require("./addReaction")

class Message {
  author = {}
  #cookies = {}
  constructor(node, cookies) {
    this.#cookies = cookies
    let id
    if (!node.author) {
      let avatar = node.querySelector(".avatar")
      this.author.name = node.getAttribute("data-author")
      this.author.id = Number(avatar.getAttribute("data-user-id"))
      avatar = avatar.firstChild
      this.author.avatar = null
      if (avatar.rawTagName === "img") this.author.avatar = avatar.getAttribute("src")
      this.createdOn = new Date(node.querySelector("header time").getAttribute("datetime"))
      const content = node.querySelector(".message-userContent")
      this.content = content.text.trim()
      id = content.getAttribute("data-lb-id")
    } else {
      // json object as argument
      this.author = node.author
      this.createdOn = node.createdOn
      this.content = node.content
      id = node.message_id
    }
    if (typeof id === "number") this.message_id = id
    else {
      this.message_id = Number(id.replace(/[^[0-9]/g, ""))
      this.type = id.replace(/[^A-z]/g, "")
      if (this.type.startsWith("message")) this.type = "conversation"
      else if (this.type === "posts") this.type = "post"
    }
  }

  async edit(content) {
    return await editMessage({ message: this, content }, this.#cookies, Message)
  }
  async delete(reason) {
    await deleteMessage({ message: this, reason }, this.#cookies)
  }
  async addReaction(reaction_id) {
    return addReaction({ message: this, reaction_id }, this.#cookies, Message)
  }
}

module.exports = Message
