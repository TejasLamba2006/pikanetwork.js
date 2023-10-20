async function handleResponse(res) {
  if (res.status !== 200) {
    if (res.status === 403) throw Error("You are not authorized to perform this action")
    throw Error("Response status: " + res.status)
  }
  const data = await res.text()
  let json = {}
  try {
    json = JSON.parse(data)
  } catch (e) {
    console.log(e)
  }
  if (json.status === "error") {
    let errors = []
    Object.entries(json.errors ?? {}).forEach(([key, value]) => {
      errors.push(`${key}: ${value}`)
    })
    throw new Error(errors.join("\n"))
  }
  return json
}

module.exports = handleResponse
