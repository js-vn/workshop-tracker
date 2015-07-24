var fs = require('fs')

module.exports.parseJsonFile = function (file) {
  try {
    return JSON.parse(fs.readFileSync(file))
  } catch (err) {
    return null
  }
}
