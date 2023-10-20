const fetch = require("node-fetch")
const convert = require("xml-js")

const SITE_MAP = ["https://jartexnetwork.com/sitemap-1.xml", "https://jartexnetwork.com/sitemap-2.xml", "https://jartexnetwork.com/sitemap-3.xml"]
let cache = {}

async function getData() {
  if ("members" in cache) return cache
  let dataSet = []

  for await (let xml of SITE_MAP) {
    const response = await fetch(xml)
    const data = await response.text()
    const jsonData = convert.xml2js(data)
    for (let url of jsonData?.elements?.[0]?.elements || []) {
      dataSet.push(url.elements[0].elements[0].text)
    }
  }
  cache.members = []
  cache.threads = []
  cache.special_pages = []
  const regex = /\/(?<name>[^./]+)\.(?<id>[0-9]+)/

  for (let link of dataSet) {
    if (link.includes("/members/")) {
      const r = link.match(regex)
      if (r) cache.members.push({ name: r.groups.name, id: Number(r.groups.id) })
    } else if (link.includes("/threads/")) {
      const r = link.match(regex)
      if (r) cache.threads.push({ name: r.groups.name, id: Number(r.groups.id) })
    } else {
      cache.special_pages.push(link.replace("https://jartexnetwork.com", ""))
    }
  }
}

async function getMembers() {
  await getData()
  return cache.members
}

async function getThreads() {
  await getData()
  return cache.threads
}

async function getSpecialThreads() {
  await getData()
  return cache.special_pages
}

module.exports = { getMembers, getThreads, getSpecialThreads }
