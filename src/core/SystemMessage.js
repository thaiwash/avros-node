/**
 * @author Taivas Gogoljuk
 **/

var Reset = "\x1b[0m"
var Bright = "\x1b[1m"
var Dim = "\x1b[2m"
var Underscore = "\x1b[4m"
var Blink = "\x1b[5m"
var Reverse = "\x1b[7m"
var Hidden = "\x1b[8m"

var FgBlack = "\x1b[30m"
var FgRed = "\x1b[31m"
var FgGreen = "\x1b[32m"
var FgYellow = "\x1b[33m"
var FgBlue = "\x1b[34m"
var FgMagenta = "\x1b[35m"
var FgCyan = "\x1b[36m"
var FgWhite = "\x1b[37m"

var BgBlack = "\x1b[40m"
var BgRed = "\x1b[41m"
var BgGreen = "\x1b[42m"
var BgYellow = "\x1b[43m"
var BgBlue = "\x1b[44m"
var BgMagenta = "\x1b[45m"
var BgCyan = "\x1b[46m"
var BgWhite = "\x1b[47m"




module.exports = {
  /**
   * Sends a system message
      https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color

   * @method
   * @param {String} message - The message.
   * @param {String} type - MSG ERROR WARNING NITICE are valid types
   */
  systemMessage(message, type) {
    if (isVoid(type)) {
      type = "MSG"
    }
    if (type == "ERROR") {
      console.log(FgRed + "Error: " + message + FgWhite)
    }
    if (type == "MSG") {
      console.log(message)
    }
    if (type == "WARNING") {
      console.log(FgYellow + "Warn: " + message + FgWhite)
    }
    if (type == "NOTICE") {
      console.log(FgGreen + "Notice: " + message + FgWhite)
    }
  }
}