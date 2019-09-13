
const EventEmitter = require('events');


/*


			"object_id": "unique id",
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

*/

module.exports = class PublicMethods extends EventEmitter {
	constructor() {
        super()
	}
	
	// Function: getPlayerSocket
	// Returns socket.IO component of the connected player
	getPlayerSocket(playerName) {
		var self = this
		var sockets = this.io.sockets.clients()
		
		var keys = Object.keys(sockets["sockets"])
		for (var i = 0; i < keys.length; i ++) {
			if (sockets.sockets[keys[i]].playerName == playerName) {
				if (isVoid(sockets.sockets[keys[i]])) {
					self.systemMessage("warnng: player "+playerName+" doesnt have a socket")
				}
				return sockets.sockets[keys[i]]
			}
		}
	}
	
	// Function: playerObjectExists
	// Returns true or false
	playerObjectExists(playerName, objectId) {
		for (var i2 = 0; i2 < this.players[playerName].objects.length; i2 ++) {
			if (this.players[playerName].objects[i2].object_id == objectId) {
				return true
			}
		}
		return false
	}
	
	
	// Function: objectExists
	// Checks if the object exists in the instance
	objectExists(objectId) {
		var playerNames = Object.keys(this.players)
		for (var i = 0; i < playerNames.length; i ++) {
			if (this.playerObjectExists(playerNames[i], objectId)) {
				return true
			}
		}
		return false
	}
	
	
	// Function: objectExists
	// Checks if the object exists in the instance
	playerHasObject(playerName, objectName) {
		var all = this.allObjects()
		for (var i = 0; i < all.length; i ++) {
			if (all[i].owner == playerName && all[i].name == objectName) {
				return true
			}
		}
		return false
	}
	
	
	// Function: createObject
	// spawns object into the instance pool
	createObject(obj) {
		var playerNames = Object.keys(this.players)
		for (var i = 0; i < playerNames.length; i ++) {
			this.getPlayerSocket(playerNames[i]).emit("object changed", obj)
		}
	}
	
	// Function: getObjectById
	// Returns object by id
	getObjectById(playerName, objectId) {
		for (var i2 = 0; i2 < this.players[playerName].objects.length; i2 ++) {
			if (this.players[playerName].objects[i2].object_id == objectId) {
				return this.players[playerName].objects[i2]
			}
		}
	}
	
	// Function: allObjects
	// Returns raw syntax objects from all players
	allObjects() {
		var objs = []
		var playerNames = Object.keys(this.players)
		for (var i = 0; i < playerNames.length; i ++) {
			if (isVoid(this.players[playerNames[i]].objects)) {
				this.players[playerNames[i]].objects = []
			}
			for (var i2 = 0; i2 < this.players[playerNames[i]].objects.length; i2 ++) {
				objs.push(this.players[playerNames[i]].objects[i2])
			}
		}
		return objs
	}
	
	
	
	// Function: generateId
	// Generates an identity
	generateId() {
		var min=1; 
		var max=100000;  
		return Math.floor(Math.random() * (+max - +min)) + +min; 
	}
}


function isVoid(variable) {
	if (typeof variable === "undefined") {
        return true
	}
    return false
}
