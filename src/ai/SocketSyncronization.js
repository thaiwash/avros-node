/**
 * @author Taivas Gogoljuk

 These functions are not publicly relevant, they define the
 socket connection pipeline.
 
 
 **/

module.exports = {
	"InitEvents": function() {
			
		this.on("IDENTITY_REQUEST_RESPONSE", function(ws, data) {
			console.log("IDENTITY_REQUEST_RESPONSE")
			ws.userName = JSON.parse(data).UserName
			ws.send("SYNCRONIZATION_REQUEST")
			this.systemMessage(ws.userName + " sends greetings.")
			/*
			self.syncTimer[ws.connectionID] = setInterval(function() {
				//console.log("tick"+ ws.connectionID)
				self.ws.send("SYNCRONIZATION_REQUEST")
			}, 1000)*/
		})
		
		this.on("SYCRONIZATION", function(ws, data) {
		  if (isVoid(data)) {
			this.SystemMessage("VOID_OF_SYNC_DATA", "WARNING")
			//socket.disconnect()
			return
		  }
		  // syncronization is called once for every reconnection;
		  //console.log(ws.connectionID)
		  this.SyncEvent(ws, JSON.parse(data))
		  
		})
	},
	
  "InitSocket": function(ws) {
    var self = this
    this.systemMessage("Connection detected", "MSG")
	this.syncTimer = []
	
    ws.send("REQUEST_USER_IDENTITY")
    
	/**/
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
	 
	if (isVoid(this.users)) {
		this.users = []
	}
	
    if (isVoid(this.users[socket.connectionID])) {


      user.objects = []
	  
		user.SyncCount = 1

      firstConnect = true
    } else {
		user.SyncCount = this.users[socket.connectionID].SyncCount + 1
      //player.objects = this.players[name].objects
    }

	
    this.users[socket.connectionID] = user
	
	if (isNaN(this.users[socket.connectionID].SyncCount)) {
		this.users[socket.connectionID].SyncCount = 1
	} else {
		this.users[socket.connectionID].SyncCount += 1
	}

    self.emit('user update', socket);
	if (firstConnect) {
		self.emit("user enter", socket)
	}
  },


}