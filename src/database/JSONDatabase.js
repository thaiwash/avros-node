module.exports = {
  /**
   * Activates a simple JSON databse

   * @method
   * @param {String} jsonFile - path to a json file to save to
   */
  "ActivateJSONDatabase": function(jsonFile) {
    this.saveFile = jsonFile

    var self = this
    this.LoadState()
    this.saveStateInterval = setInterval(function() {
      self.SaveState()
    }, 3000)
  },

  "LoadState": function() {
    var saveFile = process.cwd() + "/" + this.saveFile

    if (!fs.existsSync(saveFile)) {
      fs.writeFileSync(saveFile, "{}");
    }
    try {
      var saveData = JSON.parse(fs.readFileSync(saveFile).toString())
    } catch (e) {
      if (e.message == "Unexpected end of JSON input") {
        fs.writeFileSync(saveFile, "{}")
        return
      }
    }
    if (!isVoid(saveData.players)) {
      this.players = saveData.players
    }
    if (!isVoid(saveData.requiredTasks)) {
      this.requiredTasks = saveData.requiredTasks
    }
  },

  "SaveState": function() {
    var saveFile = process.cwd() + "/" + this.saveFile

    var saveData = {
      players: this.players,
      requiredTasks: this.requiredTasks
    }
    fs.writeFile(saveFile, JSON.stringify(saveData, null, 2), function() {})
  }
}