const fetch = require("node-fetch")
const { parse } = require("node-html-parser")
const Message = require("./Message")
const postMessage = require("./postMessage")
const deleteThread = require("./deleteThread")

class Thread {
  _cookies = {}
  constructor(url, cookies, options = {}) {
    this._cookies = cookies
    this.page = options.page ?? 1

    if (typeof url === "number") {
      this.id = url
      this.url = `https://jartexnetwork.com/threads/loading_.${url}/`
    } else if (typeof url === "string") {
      this.url = url
      this.id = Number(url.match(/[0-9]+\/?$/)?.[0]?.replace("/", ""))
    } else {
      throw new Error("invalid url, url must either be a number or a string")
    }
  }

  async fetch() {
    const response = await fetch(this.url + (this.url.endsWith("/") ? "" : "/") + "page-" + this.page, { headers: { cookie: this._cookies.toString() } })
    this.url = response.url.replace(/page-[0-9]+\/?$/, "")
    if (!response.ok) {
      if (response.status === 503) throw new Error("Server error")
      throw new Error("Thread not found")
    }
    const html = await response.text()
    const document = parse(html)
    this.title = document.querySelector(".p-title")?.text.trim()
    this.createdOn = new Date(document.querySelector(".p-description time").getAttribute("datetime"))
    this.isLocked = document.querySelector(".blockStatus-message") !== null

    // creator(s)
    const creators = document.querySelectorAll(".p-description .username")
    if (creators.length === 1) this.creator = creators[0].text.trim()
    else this.creator = creators.map((el) => el.text.trim())

    // messages
    this.messages = []
    document.querySelectorAll("article.message").forEach((el) => {
      this.messages.push(new Message(el, this._cookies))
    })

    // pageNav
    this.currentPage = 1
    this.maxPages = 1
    let pageNav = document.querySelector(".pageNav-main")?.childNodes.filter((e) => e.rawTagName === "li")
    if (pageNav) {
      this.maxPages = pageNav.length
      pageNav.forEach((el, i) => {
        if (el.classList?.contains("pageNav-page--current")) this.currentPage = i + 1
      })
    }

    return document
  }

  async getPage(page) {
    if (isNaN(page)) throw Error("page must be a number")
    this.page = page
    await this.fetch()
    return this
  }

  /**
   * @param {string} content
   * @returns {Promise<Message>}
   */
  async post(content) {
    return await postMessage({ content, url: this.url }, this._cookies)
  }

  /**
   * @param {String} reason
   */
  async delete(reason) {
    await deleteThread({ url: this.url, reason }, this._cookies)
  }
}

module.exports = Thread
