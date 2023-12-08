/**
 * @author Taivas Gogoljuk

 These functions are not publicly relevant, they define the
 socket connection pipeline.
 
 
 **/

module.exports = {
	"InitEvents": function(ws) {
		var self = this
		ws.on("SYCRONIZATION", function(ws, data) {
		  if (isVoid(data)) {
			self.SystemMessage("VOID_OF_SYNC_DATA", "WARNING")
			//socket.disconnect()
			return
		  }
		  // syncronization is called once for every reconnection;
		  //console.log(ws.connectionID)
		  self.SyncEvent(ws, JSON.parse(data))
		  
		})
	},
	
  "InitSocket": function(ws) {
    this.systemMessage("Connection detected", "MSG")
	this.InitEvents(ws)
	ws.send("SYNCRONIZATION_REQUEST")
  },
  

  "SyncEvent": function(ws, data) {
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
	
    if (isVoid(this.users[ws.connectionID])) {


      user.objects = []
	  
	  user.SyncCount = 1

      firstConnect = true
    } else {
		user.SyncCount = this.users[ws.connectionID].SyncCount + 1
    }

	
    this.users[ws.connectionID] = user
	

    ws.emit('user update');
	if (firstConnect) {
		console.log("user enter emitted")
		self.emit("user enter", ws)
	}
  },


}