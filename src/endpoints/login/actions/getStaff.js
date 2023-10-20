const fetch = require("node-fetch")
const { parse } = require("node-html-parser")

async function getStaff() {
  const response = await fetch("https://jartexnetwork.com/staff")
  const data = await response.text()
  const document = parse(data)
  let staff = {}
  document.querySelectorAll(".staff-group").forEach((el) => {
    staff[el.querySelector(".staff-group-title").text] = el.querySelectorAll(".username--staff").map((e) => e.text)
  })
  return staff
}

module.exports = getStaff
