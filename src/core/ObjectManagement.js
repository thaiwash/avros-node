/**
 * @author Taivas Gogoljuk
 **/
module.exports = {


  "TransformObject": function(ws, transform) {

    //console.log("object transform|"+JSON.stringify(transform))
	ws.send("object transform|"+JSON.stringify(transform))
  },
  
  "EnableMovement": function(ws, bounds) {
    ws.send("enable movement|"+JSON.stringify(bounds))
  },
  
  "AttachUser": function(ws, object) {
    ws.send('attach user|{"object_id": '+object.id+'}')
  },
  
  "DeleteObject": function(ws, object) {
    ws.send('delete object|{"object_id": '+object.id+'}')
  },
  
  "MoveUser": function(ws, position) {
	  
	// make an empty game object
	var userRelocationThing = new AVROS.Thing("relocation")
	
	// at users head location
	userRelocationThing.position = this.users[ws.connectionID].head.position
	this.DescribeObject(ws, userRelocationThing)
	
	// attach user to that object
	this.AttachUser(ws, userRelocationThing)
	
	// move object to a new location
	userRelocationThing.position = position
	this.DescribeObject(ws, userRelocationThing)
	
	// delete the transport object
	this.DeleteObject(ws, userRelocationThing)
	
	//position.y += 2
	//this.users[ws.connectionID].head.position = position
	
  },


  /**
   * Describe object to unity instance
   * @method
   * @param {Object} Object - Object to update
   * @param {String} PlayerName - Updated player's name. Required if instance sharing is disabled
   */
  "DescribeObject": function(ws, object) {

	if (isVoid(object)) {
		console.log("Invalid object passed to DescribeObject")
		return
	}
    //console.log("describe object|"+object.getJSON())
	ws.send("describe object|"+object.getJSON())


    // convert to API interpretable form
    //var objArr = this.Construct(data)

    //console.log(objArr)
/*
    for (var i = 0; i < objArr.length; i++) {
      if (!this.instanceSharing) {
        if (isVoid(this.players[player])) {
          this.systemMessage("Player list disintegrity " + player, "ERROR")
          console.log(this.players)
          return
        }


        var socket = this.GetPlayerSocket(player)
        if (isVoid(socket)) {
          this.systemMessage("Player socket disintegrity " + player, "ERROR")
          return
        }
        this.systemMessage(player + ": Spawn object", "NOTICE")
        this.systemMessage(JSON.stringify(objArr[i]), "NOTICE")
        this.emit("object changed", objArr[i])

        socket.emit("object description", objArr[i])
        this.UpdatePlayerObjectLedger(player, objArr[i])

      } else {
        console.log("sockets emit")
        // multiplayer
        // todo: broadcast to all players within a range
        this.emit("object changed", objArr[i])
        this.io.sockets.emit("object description", objArr[i])
      }
    }*/

  },
  /**
   * Bookkeeping
   * @method
   * @param {String} player - Player's name.
   * @param {Object} data - Object to update
   */
  "UpdatePlayerObjectLedger": function(player, data) {

    // Update player spesific object ledger
    var objs = this.players[player].objects
    for (var i = 0; i < objs.length; i++) {
      if (objs[i].object_id == data.object_id) {
        objs[i] = data
        return
      }
    }
    this.players[player].objects.push(data)
  },

  /**
   * Called whenever player changes anything
   * @method
   * @param {Object} data - Object to update
   * @param {String} player - Updated player's name. Required if instance sharing is disabled
   */

  "ObjectUpdateEvent": function(data, player) {
    this.emit("object changed", data)
    /* this seems to be broken so lets leave this to synronization AI
    if (this.instanceSharing) {
      this.GetPlayerSocket(player).broadcast.emit("object changed", data)
    }
    */
    this.UpdatePlayerObjectLedger(player, data)
    this.systemMessage("" + player + " changed object " + data.name + " " + data.object_id, "NOTICE")
  },


  /**
   * Get all objects within the instance
   * @method
   * @return {Array} data - all objects
   */
  "AllObjects": function() {
    var objs = []
    var playerNames = Object.keys(this.players)
    for (var i = 0; i < playerNames.length; i++) {
      if (isVoid(this.players[playerNames[i]].objects)) {
        this.players[playerNames[i]].objects = []
      }
      for (var i2 = 0; i2 < this.players[playerNames[i]].objects.length; i2++) {
        objs.push(this.players[playerNames[i]].objects[i2])
      }
    }
    return objs
  },
  /**
   * Add tag to object to change its behavior

   Available tags:

   - Grabable - Makes object grabbable by the human
   - Scalable - Enables object scaling (needs grabable flag to work)
   - GrabMyParent - This is for grabbable child objects [todo: refacture out]

   * @method
   * @param {Int} object_id - Object id
   * @param {String} tag - Tag to add
   */

  "AddTag": function(ws, object, tag) {
    ws.send("add tag|"+JSON.stringify({
      "object_id": object.object_id,
      "tag": tag
    }))
  },
  /**
   * Remove tag to object

   * @method
   * @param {Int} object_id - Object id
   * @param {String} tag - Tag to remove
   */

  "RemoveTag": function(object_id, tag) {
    this.io.sockets.emit("remove tag", {
      "object_id": object_id + "",
      "tag": tag
    })
  },

  /**
   * Get object by id

   * @method
   * @param {Int} object_id - Object id
   * @returns {Object} - Object
   */

  "GetObjectById": function(objectId) {
    var objs = this.AllObjects()
    for (var i = 0; i < objs.length; i++) {
      if (objs[i].object_id + "" == objectId) {
        return objs[i]
      }
    }
  },

  /**
   * Get children

   * @method
   * @param {Object} object - Constructed object
   * @returns {Array} - Object array
   */

  "GetChildren": function(object) {
    var objs = this.AllObjects()
    var ret = []
    for (var i = 0; i < objs.length; i++) {
      if (objs[i].parent == object.object_id) {
        ret.push(objs[i])
      }
    }
    return ret
  },


  /**

     * Creates an object id
     * @method
     * @returns {Int} Returns the generated id
     */
  "GenerateId": function() {
    var min = 1000
    var max = 10000000
    var rand = (Math.floor(Math.random() * (+max - +min)) + min)
    var objs = this.AllObjects()
    for (var i = 0; i < objs.length; i++) {
      if (objs[i] == rand) {
        rand = (Math.floor(Math.random() * (+max - +min)) + min)
        i = 0
        this.systemMessage("dublicate id event")
      }
    }
    return rand;
  }
}