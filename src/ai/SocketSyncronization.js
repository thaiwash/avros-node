/**
 * @author Taivas Gogoljuk

 These functions are not publicly relevant, they define the
 socket connection pipeline.
 **/

module.exports = {
  "InitSocket": function(socket) {
    var self = this
    this.systemMessage("Connection detected", "MSG")

    socket.inited = false
    socket.on("syncronization event", function(data) {
      if (isVoid(data)) {
        self.SystemMessage("Bad client dsconnected", "WARNING")
        socket.disconnect()
        return
      }
      self.SyncEvent(socket, data)
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
      self.ObjectUpdateEvent(data, socket.playerName)
    })

    socket.on("object registered", function(data) {
      self.systemMessage("Object registered event deoricated", "WARNING")
      //self.changeObject(socket, data)
    })

    socket.emit("who are you")
    socket.on("i am", function(data) {
      socket.playerName = data["playerName"]
      socket.emit("connection accepted")
      socket.emit("syncronization event callback")
      self.systemMessage(data["playerName"] + " sends greetings")

    })

    socket.on("name changed", function(data) {
      socket.playerName = data["playerName"]
    })


    socket.on('disconnect', function(obj) {
      self.systemMessage(socket.playerName + " left the server")
      delete(self.players[socket.playerName])
    })


  },

  "SyncEvent": function(socket, data) {
    var name = socket.playerName
    var self = this

    var player = this.ParseSyncData(data["data"])

    var controllerDistraction = 0

    var firstConnect = false

    if (isVoid(this.players[name])) {

      socket.syncTimeout = setTimeout(function() {
        socket.emit("syncronization event callback")
        self.SyncEvent(socket, data)
      }, 0)

      socket.playerName = name

      player.leftController.object_id = this.GenerateId()
      player.rightController.object_id = this.GenerateId()
      player.head.object_id = this.GenerateId()
      player.objects = []

      self.systemMessage("" + name + " connected")
      firstConnect = true
    } else {
      player.objects = this.players[name].objects
      player.leftController.object_id = this.players[name].leftController.object_id
      player.rightController.object_id = this.players[name].rightController.object_id
      player.head.object_id = this.players[name].head.object_id
    }



    this.players[name] = player

    if (firstConnect) {
      /**
       * Called whever a new player connects.
       *
       * @event player entered
       * @property {string}  - Player name
       */
      self.emit('player enter', name);

      //TODO: Spawn environment
    }
  },

  "ParseSyncData": function(data) {
    if (isVoid(data)) {
      this.systemMessage("Sync data is void", "ERROR")
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
    user.head.position = new Vector3(
      parseFloat(values[0][0]),
      parseFloat(values[0][1]),
      parseFloat(values[0][2])
    )
    user.head.rotation = new Quaternion(
      parseFloat(values[1][0]),
      parseFloat(values[1][1]),
      parseFloat(values[1][2]),
      parseFloat(values[1][3])
    )
    user.rightController = {}
    user.rightController.position = new Vector3(
      parseFloat(values[2][0]),
      parseFloat(values[2][1]),
      parseFloat(values[2][2])
    )
    user.rightController.rotation = new Quaternion(
      parseFloat(values[3][0]),
      parseFloat(values[3][1]),
      parseFloat(values[3][2]),
      parseFloat(values[3][3])
    )
    user.leftController = {}
    user.leftController.position = new Vector3(
      parseFloat(values[4][0]),
      parseFloat(values[4][1]),
      parseFloat(values[4][2])
    )
    user.leftController.rotation = new Quaternion(
      parseFloat(values[5][0]),
      parseFloat(values[5][1]),
      parseFloat(values[5][2]),
      parseFloat(values[5][3])
    )

    user.rightController.grabberId = parse[6]
    user.leftController.grabberId = parse[7]

    return user
  },


  /**
   * Select player specific socket
   *
   * @method
   * @param {String} playerName - player name
   * @return {Object} socket.IO component -  of the connected player
   */
  "GetPlayerSocket": function(playerName) {
    var self = this
    var sockets = this.io.sockets.clients()

    var keys = Object.keys(sockets["sockets"])
    for (var i = 0; i < keys.length; i++) {
      if (sockets.sockets[keys[i]].playerName == playerName) {
        if (isVoid(sockets.sockets[keys[i]])) {
          self.systemMessage("player " + playerName + " doesnt have a socket", "WARNING")
        }
        return sockets.sockets[keys[i]]
      }
    }
  }
}