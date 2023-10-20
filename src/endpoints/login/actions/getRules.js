const fetch = require("node-fetch")

async function getRules(type) {
  const response = await fetch(`https://staff.jartexnetwork.com/api/rules/rules/`)
  const json = await response.json()
  return json
}

module.exports = getRules
