const fetch = require("node-fetch");
const cheerio = require("cheerio");
const config = require("../../jsons/config.json");
const errorConfig = require("../../jsons/error.json");
const Cookies = require("./cookies.js");
const createConversation = require("./actions/createConversation");
const Conversation = require("./actions/Conversation");
const postMessage = require("./actions/postMessage");
const Thread = require("./actions/Thread");
const getMessage = require("./actions/getPost");
const createBugReport = require("./actions/bugReport");
const gameplayReport = require("./actions/gameplayReport");
const chatReport = require("./actions/chatReport");
const createThread = require("./actions/createThread");

class Account {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.cookies = new Cookies();
    this.loginUrl = "https://pika-network.net/login/login";
  }

  /**
   * Logs the user into the system.
   *
   * @return {boolean} True if the login is successful.
   */
  async login() {
    await this.cookies.update();
    this.settings = {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "content-type": "application/x-www-form-urlencoded",
        cookie: "xf_csrf=" + this.cookies.get("xf_csrf"),
      },
      body: `login=${this.username}&password=${
        this.password
      }&_xfRedirect=/&remember=1&_xfToken=${this.cookies.get("_xfToken")}`,
      method: "POST",
      redirect: "manual", // We need this to get the 303 status instead of 200 ( status 303 contains the set cookie header)
    };
    const response = await fetch(this.loginUrl, this.settings);
    const $ = await response.text();
    if (response.status === 400) {
      throw new Error(`${config.prefix} ${errorConfig.forum}\n Incorrect username or password`);
    } else if (response.status !== 303) {
      throw new Error(
        `${config.prefix} ${errorConfig.forum}\n ${errorConfig.responseCode} ${response.status}`
      );
    }
    const cookieHeader = response.headers.get("set-cookie");
    let c = this.cookies.parse(cookieHeader);
    if (!c.xf_session)
      throw new Error(`${config.prefix} ${errorConfig.forum}\n ${errorConfig.xf_session}`);
    this.cookies.set("xf_session", c.xf_session);
    if (!c.xf_user)
      throw new Error(`${config.prefix} ${errorConfig.forum}\n ${errorConfig.xf_user}`);
    this.cookies.set("xf_user", c.xf_user);
    this.cookies.setAccount(this);
    return true;
  }
  /**
   * Check if the user is logged in.
   *
   * @return {boolean} True if the user is logged in, false otherwise.
   */
  isLoggedIn() {
    return this.cookies.isLoggedIn();
  }
  /**
   * Checks if the user is authenticated.
   *
   * @return {undefined} Throws an error if the user is not logged in.
   */
  authCheck() {
    if (!this.isLoggedIn())
      throw new Error(`${config.prefix} ${errorConfig.forum}\n You must be logged in`);
  }
  /**
   * Retrieves the value of the cookies.
   *
   * @return {Cookies} An object representing the cookies.
   */
  getCookies() {
    return this.cookies;
  }
  async createConversation(details) {
    this.authCheck();
    return await createConversation(details, this.cookies);
  }
  async createBugReport(options) {
    this.authCheck();
    return await createBugReport(options, this.cookies);
  }
  /**
   * Creates a gameplay report.
   *
   * @param { username:string, gamebreaker:string, rule:string, gamemode:string, evidence:string, extra_information?:string} options
   * @return {Promise} - A promise that resolves to the gameplay report.
   */
  async createGameplayReport(options) {
    this.authCheck();
    return await gameplayReport(options, this.cookies);
  }

  async createChatReport(options) {
    this.authCheck();
    return await chatReport(options, this.cookies);
  }

  async createThread(options) {
    return await createThread(options, this.cookies);
  }
}

//class

module.exports = Account;
