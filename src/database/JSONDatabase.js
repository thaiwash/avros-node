module.exports = {
  /**
   * Activates a simple JSON databse
   This feature would need some refacturing if its necessairy

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
      this.saveState()
    }
    try {
      var saveData = JSON.parse(fs.readFileSync(saveFile).toString())
    } catch (e) {
      if (e.message == "Unexpected end of JSON input") {
        this.SaveState()
        return
      }
    }

    if (isVoid(saveData.players)) {
      this.SaveState()
    } else {
      this.ReconstructState(saveData)
    }
    /*
    if (!isVoid(saveData.players)) {
      this.players = saveData.players
    }
    if (!isVoid(saveData.requiredTasks)) {
      this.requiredTasks = saveData.requiredTasks
    }
    */
  },

  "ReconstructState": function(data) {
    this.players = []
    for (var i = 0; i < data.players.name.length; i++) {
      this.players[data.players.name[i]] = {}

      this.players[data.players.name[i]].head = {}
      this.players[data.players.name[i]].head.position = new Vector3(
        data.players.head[i].position.x,
        data.players.head[i].position.y,
        data.players.head[i].position.z
      )
      this.players[data.players.name[i]].head.rotation = new Quaternion(
        data.players.head[i].rotation.x,
        data.players.head[i].rotation.y,
        data.players.head[i].rotation.z,
        data.players.head[i].rotation.w
      )

      this.players[data.players.name[i]].rightController = {}
      this.players[data.players.name[i]].rightController.position = new Vector3(
        data.players.rightController[i].position.x,
        data.players.rightController[i].position.y,
        data.players.rightController[i].position.z
      )
      this.players[data.players.name[i]].rightController.rotation = new Quaternion(
        data.players.rightController[i].rotation.x,
        data.players.rightController[i].rotation.y,
        data.players.rightController[i].rotation.z,
        data.players.rightController[i].rotation.w
      )

      this.players[data.players.name[i]].leftController = {}
      this.players[data.players.name[i]].leftController.position = new Vector3(
        data.players.leftController[i].position.x,
        data.players.leftController[i].position.y,
        data.players.leftController[i].position.z
      )
      this.players[data.players.name[i]].leftController.rotation = new Quaternion(
        data.players.leftController[i].rotation.x,
        data.players.leftController[i].rotation.y,
        data.players.leftController[i].rotation.z,
        data.players.leftController[i].rotation.w
      )

      this.players[data.players.name[i]].objects = data.players.objects[i]
    }
  },

  "DeconstructState": function() {
    var _players = {}
    _players.name = []
    _players.head = []
    _players.rightController = []
    _players.leftController = []
    _players.objects = []
    for (var name in this.players) {
      _players.name.push(name)
      var head = {}
      head.position = {
        "x": this.players[name].head.position.x,
        "y": this.players[name].head.position.y,
        "z": this.players[name].head.position.z
      }
      head.rotation = {
        "x": this.players[name].head.rotation.x,
        "y": this.players[name].head.rotation.y,
        "z": this.players[name].head.rotation.z,
        "w": this.players[name].head.rotation.w
      }
      _players.head.push(head)

      var rightController = {}

      rightController.position = {
        "x": this.players[name].rightController.position.x,
        "y": this.players[name].rightController.position.y,
        "z": this.players[name].rightController.position.z
      }
      rightController.rotation = {
        "x": this.players[name].rightController.rotation.x,
        "y": this.players[name].rightController.rotation.y,
        "z": this.players[name].rightController.rotation.z,
        "w": this.players[name].rightController.rotation.w
      }
      _players.rightController.push(rightController)

      var leftController = {}
      leftController.position = {
        "x": this.players[name].leftController.position.x,
        "y": this.players[name].leftController.position.y,
        "z": this.players[name].leftController.position.z
      }
      leftController.rotation = {
        "x": this.players[name].leftController.rotation.x,
        "y": this.players[name].leftController.rotation.y,
        "z": this.players[name].leftController.rotation.z,
        "w": this.players[name].leftController.rotation.w
      }
      _players.leftController.push(leftController)
      _players.objects.push(this.players[name].objects)
    }
    return _players
  },

  "SaveState": function() {
    var saveFile = process.cwd() + "/" + this.saveFile
    var _players = this.DeconstructState()
    var saveData = {
      players: _players
    }
    fs.writeFile(saveFile, JSON.stringify(saveData, null, 2), function() {})
  }
}