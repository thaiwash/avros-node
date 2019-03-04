var fs = require("fs")
var THREE = require("./threejs/three.js")
eval(fs.readFileSync("threejs/additionalRenderers.js").toString())
eval(fs.readFileSync("threejs/SceneUtils.js").toString())
const express = require('express')


/*
c# warn: controller sphere registeres with wrong id
c# warn: opening multiple sockets
c# bug: user_id is object_id
c# bug: not syncing on autoconnect
*/

class AVROS {
	constructor() {
        var self = this
		this.artificialLag = 1000
		this.players = {}
		this.entanglements = []
		this.personal = [
			"Main Menu",
			"Keyboard",
			"Desktop Mirror"
		]
		
		this.personalObjectDefinitions = {
			"Main Menu": "cube",
			"Main MenuMainPlane": "plane",
			"Main MenuBackPlane": "plane",
			"Keyboard": "mesh",
			"Desktop Mirror": "cube",
			"Main MenuMainPlane": "plane",
			"Main MenuBackPlane": "plane"
		}
		
		/* move to object property
		this.textureUpdateInterval = setInterval(function() {
			self.textureUpdate()
		}, 1000)
		*/
		
	} 
	
	open(port) {
        var self = this
		
		
		this.app = express()

		this.app.use(express.static('public'))
		
		this.app.get('/players', function(req, res) {
			res.send(JSON.stringify(self.players, 0, 4));
			res.end();
		})
		var server = require('http').createServer(this.app);
		/*
		this.app = require('http').createServer(function (req, res) {
			if (fs.existsSync("./public"+req.url)) {
				if (!fs.lstatSync("./public"+req.url).isDirectory()) {
					res.write(fs.readFileSync("./public"+req.url));
					res.end();
				}
			}
			
			if (req.url == "/") {
				res.write(fs.readFileSync("./public/index.html"));
				res.end();
			}
			
			if (req.url == "/players") {
				res.write(JSON.stringify(self.players, 0, 4));
				res.end();
			}
			if (req.url == "/entanglements") {
				res.write(JSON.stringify(self.entanglements, 0, 4));
				res.end();
			}
		})*/
		
		this.io = require('socket.io')(server);

		server.listen(port);
		
		this.io.on('connection', function(socket) {
			console.log("server: connection detected")
			self.initSocket(socket)
		})
		
		
		console.log("server: AVROS server listening on port "+ port)
		self.initTimers()
	}
	
	getPlayerSocket(playerName) {
		var sockets = this.io.sockets.clients()
		
		var keys = Object.keys(sockets["sockets"])
		for (var i = 0; i < keys.length; i ++) {
			if (sockets.sockets[keys[i]].playerName == playerName) {
				if (isVoid(sockets.sockets[keys[i]])) {
					console.log("warnng: player "+playerName+" doesnt have a socket")
				}
				return sockets.sockets[keys[i]]
			}
		}
	}
	
	initTimers() {
        var self = this
		this.bindScanInterval = setInterval(function() {
			self.bindScan()
		}, 1000)
		
		this.socketCleanupInterval = setInterval(function() {
			self.socketCleanup()
		}, 10000)
		
		this.entanglementSyncInterval = setInterval(function() {
			self.entanglementSync()
		}, 3000)
	}
	
	socketCleanup() {
		var sockets = this.io.sockets.clients()
		//console.log(Object.keys(sockets))
		var keys = Object.keys(sockets["sockets"])
		
		var connectedPlayers = []
		for (var i = 0; i < keys.length; i ++) {
			//(sockets[keys[i]])
			//console.log(keys[i])
			//console.log(Object.keys(sockets["sockets"][keys[i]]))
			//console.log(sockets["sockets"][keys[i]].playerName)
			
			//console.log(sockets["sockets"][keys[i]].playerName)
			
			if (isVoid(sockets["sockets"][keys[i]].playerName)) {
				console.log("server: Unidentified socket disconnected")
				sockets["sockets"][keys[i]].disconnect()
				continue
			} else {
				connectedPlayers.push(sockets["sockets"][keys[i]].playerName)
			}
			/*
			if (this.players[sockets["sockets"][keys[i]].playerName].socket.id != keys[i]) {
				console.log("server: Socket id mismash, smash")
				sockets["sockets"][keys[i]].disconnect()
			}*/
		}
		
		var playerNames = Object.keys(this.players)
		for (var i = 0; i < playerNames.length; i ++) {
			if (connectedPlayers.indexOf(playerNames[i]) == -1) {
				delete(this.players[playerNames[i]])
			}
		}
		console.log("server: no sockets "+ keys.length + " "+Object.keys(this.players))
	}
	
	isSimilar(obj1, obj2) {
		
		if (isVoid(obj1)) {
			return false
		}
		if (isVoid(obj2)) {
			return false
		}
		var keys = Object.keys(obj1)
		for (var i = 0; i < keys.length; i ++) {
			if (keys[i] == "object_id") {
				continue
			}
			if (isVoid(obj2[keys[i]])) {
				return false
			}
			if (obj1[keys[i]] != obj2[keys[i]]) {
				return false
			}
		}
		return true
	}
	
	allObjects() {
		var objs = []
		var playerNames = Object.keys(this.players)
		for (var i = 0; i < playerNames.length; i ++) {
			if (isVoid(this.players[playerNames[i]].objects)) {
				this.players[playerNames[i]].objects = []
			}
			for (var i2 = 0; i2 < this.players[playerNames[i]].objects.length; i2 ++) {
				objs.push(this.players[playerNames[i]][i2])
			}
		}
		return objs
	}
	
	bindScan() {
		//console.log("bind scan")
		var objs = this.allObjects()
		for (var i = 0; i < objs.length; i ++) {
			var group = []
			for (var i2 = 0; i2 < objs.length; i2 ++) {
				if (this.isSimilar(objs[i], objs[i2])) {
					group.push(objs[i2])
				}
			}
			if (group.length > 1) {
				this.entangle(group)
			}
		}
	}
	
	isPersonal(obj) {
		var objs = this.allObjects()
		for (var i = 0; i < objs.length; i ++) {
			if (objs[i].object_id == obj.parent) {
				if (this.personal.indexOf(objs[i].name) != -1) {
					return true
				}
				obj = objs[i]
				if (isVoid(obj.parent)) {
					return false
				}
				i = 0
			}
		}
		return false
	}
	
	entangle(group) {
		if (isPersonal(group[0])) {
			return
		}
		
		for (var i = 0; i < this.entangelements.length; i ++) {
			if (this.entangelements[i][0].name == group[0].name) {
				this.entangelements[i] = group[0]
				return
			}
		}
		
		this.entangelements.push(group)
	}
	
	
	entanglementSync() {
		for (var i = 0; i < this.entanglements.length; i ++) {
			var master = this.entanglements[i][0]
			for (var i2 = 1; i2 < this.entanglements.length; i2 ++) {
				if (!isSimilar(master, this.entanglements[i][i2])) {
					this.entanglements[i][i2] = this.syncObjectWith(
						this.entanglements[i][i2], 
						master
					)
				}
			}
		}
		
		this.checkForMissingObjects()
	}
	
	checkForMissingObjects() {
		var objs = this.allObjects()
		var playerNames = Object.keys(this.players)
		for (var i = 0; i < playerNames.length; i ++) {
			for (var i2 = 0; i2 < this.players[playerNames[i]].objects.length; i2 ++) {
				var obj = this.players[playerNames[i]].objects[i2]
				if (!isVoid(obj.type)) {
					for (var i3 = 0; i3 < playerNames.length; i3 ++) {
						var found = false
						for (var i4 = 0; i4 < this.players[playerNames[i3]].objects.length; i4 ++) {
							var obj2 = this.players[playerNames[i3]].objects[i4]
							if (obj.name == obj2.name) {
								var found = true
							}
						}
						if (!found) {
							console.log("player "+playerNames[i3]+ " is missing object "+obj.name)
							if (isVoid(this.getPlayerSocket(playerNames[i3]))) {
								console.log("warning: player "+playerNames[i3]+ " is missing a socket")
								return
							}
							this.getPlayerSocket(playerNames[i3]).emit("object changed", obj)
						}
					}
				}
			}
		}
	}
	
	syncObjectWith(obj, master) {
		var newObj = master
		newObj.object_id = obj.object_id
		this.io.sockets.emit("object changed", newObj)
		return newObj
	}
	
	registerObject(socket, data) {
		console.log("registering object")
		if (isVoid(socket.playerName)) {
			return
		}
		
		if(isVoid(this.players[socket.playerName])){
			console.log("server: warning; syncing before inited")
			return
		}
		console.log("server "+socket.playerName+" registered object " + data.name + " " + data.object_id)
		
		if (data.type != "") {
			socket.broadcast.emit("object changed", data)
		}
		
		
		var objs = this.players[socket.playerName].objects
		for (var i = 0; i < objs.length; i ++) {
			if (objs[i].object_id == data.object_id) {
				objs[i] = data
				return
			}
		}
		this.players[socket.playerName].objects.push(data)
	}
	
	initSocket(socket) {
        var self = this
		console.log("server: connection detected")

        socket.inited = false
		socket.on("syncronization event", function(data) {
			//console.log("server: sync ")
			//console.log(JSON.stringify(data, 0, 4))
			if (isVoid(data)) {
				console.warn("server: bad client dsconnected")
				socket.disconnect()
				return
			}
			self.syncEvent(socket, data)
			
			clearTimeout(self.players[socket.playerName].syncTimer)
			setTimeout(function() {
				socket.emit("syncronization event callback")
			}, self.artificialLag)
        })
		
        socket.on("object changed", function(data) {
            self.registerObject(socket, data)
        })

		console.log("server: who are you")
		socket.emit("who are you")
		socket.on("i am", function (data) {
            setTimeout(function() {
                socket.emit("tts", {"say": "Hello " + data["playerName"]})
            }, 2000)
			socket.playerName = data["playerName"]
			socket.emit("connection accepted")
			socket.emit("syncronization event callback")
		})
		
        socket.on("name changed", function(data) {
			socket.playerName = data["playerName"]
        })
		
		
		socket.on('disconnect', function(obj) {
			console.log(socket.playerName+" left the server")
			delete(self.players[socket.playerName])
		})
	}

	syncEvent(socket, data) {
		var name = socket.playerName
        var self = this
		
		var player = this.parseSyncData(data["data"])
		
		var controllerDistraction = 0
		
		if (isVoid(this.players[name])) {
			
			socket.syncTimeout = setTimeout(function() {
				socket.emit("syncronization event callback")
				self.syncEvent(socket, data)
			}, 0)

            socket.playerName = name

            player.leftController.object_id = this.generateId()
            player.rightController.object_id = this.generateId()
            player.objects = []
			
			console.log("server: "+name+" connected")
			
		} else {
            player.objects = this.players[name].objects
			player.leftController.object_id = this.players[name].leftController.object_id
			player.rightController.object_id = this.players[name].rightController.object_id
		}
		
		var evt = {
			"object_id": player.leftController.object_id.toString(),
			"type": "sphere",
			"scaleX": "0.04500",
			"scaleY": "0.04500",
			"scaleZ": "0.04500",
			"posX": (player.leftController.position.x + controllerDistraction).toString(),
			"posY": player.leftController.position.y.toString(),
			"posZ": player.leftController.position.z.toString(),
			"name": name+"LeftControllerNoGra"
		}
		socket.emit("object changed", evt)
		socket.broadcast.emit("object changed", evt)
				
		var evt2 = {
			"object_id": player.rightController.object_id.toString(),
			"type": "sphere",
			"scaleX": "0.04500",
			"scaleY": "0.04500",
			"scaleZ": "0.04500",
			"posX": (player.rightController.position.x + controllerDistraction).toString(),
			"posY": player.rightController.position.y.toString(),
			"posZ": player.rightController.position.z.toString(),
			"name": name+"RightControllerNoGra"
		}
		//console.log(evt2.name)
		socket.emit("object changed", evt2)
		socket.broadcast.emit("object changed", evt2)
		
		
		this.players[name] = player
		
    }

    parseSyncData(data) {
		if (isVoid(data)) {
			console.log("server: sync data is void")
			return
		}
        var parse = data.split("|")
        var values = [];
        for (var i = 0; i < parse.length; i ++) {
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

module.exports = new AVROS()
