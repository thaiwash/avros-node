/**
 * @author Taivas Gogoljuk

 These functions are not publicly relevant, they define the
 socket connection pipeline.
 **/

module.exports = {
  "initSocket": function(socket) {
    var self = this
    this.systemMessage("server: connection detected")

    socket.inited = false
    socket.on("syncronization event", function(data) {
      if (isVoid(data)) {
        self.systemMessage("server: bad client dsconnected")
        socket.disconnect()
        return
      }
      self.syncEvent(socket, data)
      /**
     * Called whever player sends updated information
     * Can be used for ping tracking.
     *
     * @event player update
     * @property {string}  - Player name
     */
      self.emit("player update", socket.playerName)
      clearTimeout(self.players[socket.playerName].syncTimer)
      setTimeout(function() {
        socket.emit("syncronization event callback")
      }, 100)
    })

    socket.on("object changed", function(data) {
      self.changeObject(socket, data)
    })

    socket.on("object registered", function(data) {
      self.changeObject(socket, data)
    })

    this.systemMessage("server: who are you")
    socket.emit("who are you")
    socket.on("i am", function(data) {
      socket.playerName = data["playerName"]
      socket.emit("connection accepted")
      socket.emit("syncronization event callback")
      self.systemMessage(data["playerName"] + " identified")

    })

    socket.on("name changed", function(data) {
      socket.playerName = data["playerName"]
    })


    socket.on('disconnect', function(obj) {
      self.systemMessage(socket.playerName + " left the server")
      delete(self.players[socket.playerName])
    })
  },

  "syncEvent": function(socket, data) {
    var name = socket.playerName
    var self = this

    var player = this.parseSyncData(data["data"])

    var controllerDistraction = 0

    var firstConnect = false

    if (isVoid(this.players[name])) {

      socket.syncTimeout = setTimeout(function() {
        socket.emit("syncronization event callback")
        self.syncEvent(socket, data)
      }, 0)

      socket.playerName = name

      player.leftController.object_id = this.generateId()
      player.rightController.object_id = this.generateId()
      player.head.object_id = this.generateId()
      player.objects = []

      self.systemMessage("server: " + name + " connected")
      firstConnect = true
    } else {
      player.objects = this.players[name].objects
      player.leftController.object_id = this.players[name].leftController.object_id
      player.rightController.object_id = this.players[name].rightController.object_id
      player.head.object_id = this.players[name].head.object_id
    }

    var showHeftHand = {
      "object_id": player.leftController.object_id.toString(),
      "type": "sphere",
      "scaleX": "0.04500",
      "scaleY": "0.04500",
      "scaleZ": "0.04500",
      "posX": (player.leftController.position.x + controllerDistraction).toString(),
      "posY": player.leftController.position.y.toString(),
      "posZ": player.leftController.position.z.toString(),
      "name": name + "LeftController",
      "owner": name
    }

    var showRightHand = {
      "object_id": player.rightController.object_id.toString(),
      "type": "sphere",
      "scaleX": "0.04500",
      "scaleY": "0.04500",
      "scaleZ": "0.04500",
      "posX": (player.rightController.position.x + controllerDistraction).toString(),
      "posY": player.rightController.position.y.toString(),
      "posZ": player.rightController.position.z.toString(),
      "name": name + "RightController",
      "owner": name
    }

    var showHead = {
      "object_id": player.head.object_id.toString(),
      "type": "sphere",
      "scaleX": "0.04500",
      "scaleY": "0.04500",
      "scaleZ": "0.04500",
      "posX": player.head.position.x.toString(),
      "posY": player.head.position.y.toString(),
      "posZ": player.head.position.z.toString(),
      "rotX": player.head.rotation._x.toString(),
      "rotY": player.head.rotation._y.toString(),
      "rotZ": player.head.rotation._z.toString(),
      "rotW": player.head.rotation._w.toString(),
      "name": "PlayerCamera",
      "owner": name
    }


    this.players[name] = player

    if (firstConnect) {
      self.emit('player entered', name);
    }
  }

  parseSyncData(data) {
    if (isVoid(data)) {
      this.systemMessage("server: sync data is void")
      return
    }
    var parse = data.split("|")
    var values = [];
    for (var i = 0; i < parse.length; i++) {
      var chop = parse[i].replace("(", "")
      chop = chop.replace(")", "")
      chop = chop.replace(" ", "")
      chop = chop.replace(" ", "")
      chop = chop.replace(" ", "")
      chop = chop.replace(" ", "")
      values.push(chop.split(","))
    }
    var user = {}
    user.head = {}
    user.head.position = new THREE.Vector3(
      parseFloat(values[0][0]),
      parseFloat(values[0][1]),
      parseFloat(values[0][2])
    )
    user.head.rotation = new THREE.Quaternion(
      parseFloat(values[1][0]),
      parseFloat(values[1][1]),
      parseFloat(values[1][2]),
      parseFloat(values[1][3])
    )
    user.rightController = {}
    user.rightController.position = new THREE.Vector3(
      parseFloat(values[2][0]),
      parseFloat(values[2][1]),
      parseFloat(values[2][2])
    )
    user.rightController.rotation = new THREE.Quaternion(
      parseFloat(values[3][0]),
      parseFloat(values[3][1]),
      parseFloat(values[3][2]),
      parseFloat(values[3][3])
    )
    user.leftController = {}
    user.leftController.position = new THREE.Vector3(
      parseFloat(values[4][0]),
      parseFloat(values[4][1]),
      parseFloat(values[4][2])
    )
    user.leftController.rotation = new THREE.Quaternion(
      parseFloat(values[5][0]),
      parseFloat(values[5][1]),
      parseFloat(values[5][2]),
      parseFloat(values[5][3])
    )

    user.rightController.grabberId = parse[6]
    user.leftController.grabberId = parse[7]

    return user
  }