/**
 * @author Taivas Gogoljuk
 **/

 module.exports = {
   /**
    * Update object
    * @method
    * @param {Object} Object - Object to update
    */
   "UpdateObject": function(sender, data) {
      if (isVoid(socket.playerName)) {
        return
      }
  		if(isVoid(this.players[socket.playerName])){
  			this.systemMessage("server: warning; syncing before inited")
  			return
  		}
   		if (data.name.search("Controller") == -1 && data.name.search("Camera") == -1) {
   			this.systemMessage("server "+socket.playerName+" registered object " + data.name + " " + data.object_id)
   		}
      this.emit("object changed", data)


  		data.syncTime = (new Date()).getTime()

      // Update player spesific object ledger
  		var objs = this.players[socket.playerName].objects
  		for (var i = 0; i < objs.length; i ++) {
  			if (objs[i].object_id == data.object_id) {
  				objs[i] = data
  				return
  			}
  		}
  		this.players[socket.playerName].objects.push(data)
   }
 }



 	registerObject(socket, data) {
     //onsole.assert(isVoid(socket), "socket is void")
 		if (isVoid(socket)) {
 			return
 		}



 	}

   	changeObject(socket, data) {
   		if (isVoid(socket.playerName)) {
   			return
   		}

         		if(isVoid(this.players[socket.playerName])){
         			this.systemMessage("server: warning; syncing before inited")
         			return
         		}
   		//console.log("server "+socket.playerName+" registered object " + data.name + " " + data.object_id)

   		if (data.type != "") {
   			// let server handle syncing
   			//socket.broadcast.emit("object changed", data)
   		}

   		this.registerObject(socket, data)
   	}
