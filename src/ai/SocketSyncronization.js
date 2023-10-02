/**
 * @author Taivas Gogoljuk

 These functions are not publicly relevant, they define the
 socket connection pipeline.
 **/

module.exports = {
  "InitSocket": function(ws) {
    var self = this
	this.ws = ws
    this.systemMessage("Connection detected", "MSG")
	
    this.ws.send("REQUEST_USER_IDENTITY")
    this.on("IDENTITY_REQUEST_RESPONSE", function(data) {
		console.log("IDENTITY_REQUEST_RESPONSE")
		ws.userName = JSON.parse(data).UserName
		ws.send("SYNCRONIZATION_REQUEST")
		self.systemMessage(ws.userName + " sends greetings")
		
		self.emit("player update", ws)
    })
	
    this.on("SYCRONIZATION", function(data) {
      if (isVoid(data)) {
        self.SystemMessage("VOID_OF_SYNC_DATA", "WARNING")
        //socket.disconnect()
        return
      }
      self.SyncEvent(self.ws, JSON.parse(data))
	})
    
	/*
	setTimeout(function() {
		socket.emit("syncronization event callback")
	}, 100)*/
      /**
       * Called whever player sends updated information
       * Can be used for ping tracking.
       *
       * @event player update
       * @property {string}  - Player name
/* rewrite


    socket.inited = false

    socket.on("object changed", function(data) {
      self.ObjectUpdateEvent(data, socket.playerName)
    })

    socket.on("object registered", function(data) {
      self.systemMessage("Object registered event deoricated", "WARNING")
      //self.changeObject(socket, data)
    })


    socket.on("name changed", function(data) {
      socket.playerName = data["playerName"]
    })


    socket.on('disconnect', function(obj) {
      self.systemMessage(socket.playerName + " left the server")
      delete(self.players[socket.playerName])
    })

       */

  },



  "SyncEvent": function(socket, data) {
	console.log("SYNCRONIZATION EVENT PROCESSING START")
	console.log(data)
    var name = socket.userName
    var self = this

    var controllerDistraction = 0

    var firstConnect = false

    var user = {}
	
	user.head = {
		position: new Vector3(
			data[0].Position[0],
			data[0].Position[1],
			data[0].Position[2]
		),
		rotation: new Quaternion(
			data[0].Rotation[0],
			data[0].Rotation[1],
			data[0].Rotation[2],
			data[0].Rotation[3]
		)
	}
	user.ControllerRight = data[1]
	user.ControllerLeft = data[2]
	user.Name = data[3]
	console.log(user)
	 
	if (isVoid(this.users)) {
		this.users = []
	}
	
    if (isVoid(this.users[socket.connectionID])) {


      user.objects = []
	  

      self.systemMessage("" + name + " connected")
      firstConnect = true
    } else {
      //player.objects = this.players[name].objects
    }


	console.log(user)

    this.users[socket.connectionID] = user

    if (firstConnect) {
      /**
       * Called whever a new player connects.
       *
       * @event player entered
       * @property {string}  - Player name
       */
      self.emit('player enter', socket);

    }
  },


}