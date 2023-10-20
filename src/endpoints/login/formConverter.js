/**
 * Translate array [[key,value]] to form data
 */

function formConverter(form, webkitForm) {
  let body = []
  form.forEach(([key, value]) => {
    if (webkitForm) {
      body.push(`------WebKitFormBoundary\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`)
    }
  })
  body.push("------WebKitFormBoundary--\r\n")

  return body.join("")
}

module.exports = formConverter
