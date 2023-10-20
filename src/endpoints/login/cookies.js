const fetch = require("node-fetch");
const { parse } = require("cookie");

class Cookies {
  #cookie_cache = {};
  #account = {};
  cookies = {};

  set(name, value) {
    this.cookies[name] = value;
  }

  get(name) {
    return this.cookies[name];
  }

  toString() {
    return Object.entries(this.cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
  }

  hasCookies() {
    return Object.keys(this.cookies).length > 0;
  }

  isLoggedIn() {
    return this.get("xf_session") && this.get("xf_user");
  }

  setAccount(account) {
    this.#account = account;
  }

  get account() {
    return this.#account;
  }

  getId() {
    return Number(this.get("xf_user")?.match(/^[0-9]+/) ?? 0);
  }

  parse(cookiesHeader) {
    if (typeof cookiesHeader !== "string") return {};
    cookiesHeader = cookiesHeader.replace("HttpOnly, ", "");
    const parsedCookie = parse(cookiesHeader);
    return JSON.parse(JSON.stringify(parsedCookie));
  }

  async update(url = "https://pika-network.net/login") {
    if (this.#cookie_cache[url]) {
      const { xf_csrf, _xfToken } = this.#cookie_cache[url];
      this.set("xf_csrf", xf_csrf);
      this.set("_xfToken", _xfToken);
    } else {
      const headers = { cookie: this.toString() };
      const res = await fetch(url, { headers });
      const setCookie = res.headers.get("set-cookie");

      if (setCookie) {
        const { xf_csrf } = parse(setCookie);
        if (xf_csrf) this.set("xf_csrf", xf_csrf);
      }

      const html = await res.text();
      const { token } = html.match(/data-csrf="(?<token>[^"]+)"/)?.groups ?? {};
      if (token) this.set("_xfToken", token);

      this.#cookie_cache[url] = {
        xf_csrf: this.get("xf_csrf"),
        _xfToken: this.get("_xfToken"),
      };
    }
  }
}

module.exports = Cookies;
