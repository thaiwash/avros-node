
class AVROS {
	constructor() {
        var self = this
		this.players = {}
		this.entanglements = []
		this.personal = [
			"Main Menu",
			"Keyboard",
			"DesktopMirror"
		]
		
		this.bindScanInterval = setInterval(function() {
			self.bindScan()
		}, 1000)
		this.entanglementSyncInterval = setInterval(function() {
			self.entanglementSync()
		}, 100)
		/* move to object property
		this.textureUpdateInterval = setInterval(function() {
			self.textureUpdate()
		}, 1000)
		*/
		
	} 
	
	open(port) {
        var self = this
		this.app = require('http').createServer(function (req, res) {
			if (req.url == "/") {
				res.write("working");
				res.end();
			}
		})
		
		this.io = require('socket.io')(app);

		this.app.listen(port);
		
		io.on('connection', function(socket) {
			self.initSocket(socket)
		}
		io.on('disconnect', function(socket) {
			debug.log(socket.playerName+" left the server")
		}
		
		console.log("AVROS server listening on port"+ port)
	}
	
	isSimilar(obj1, obj2) {
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
			for (var i2 = 0; i2 < this.players[playerNames[i]].objects.length; i2 ++) {
				objs.push(this.players[playerNames[i]][i2])
			}
		}
		return objs
	}
	
	bindScan() {
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
				if (!isSimilar(master, this.entanglements[i][i2]) {
					this.entanglements[i][i2] = this.syncObjectWith(
						this.entanglements[i][i2], 
						master
					)
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
		var playerNames = Object.keys(this.players)
		for (var i = 0; i < playerNames.length; i ++) {
			for (var i2 = 0; i2 < this.players[playerNames[i]].objects.length; i2 ++) {
				if (this.players[playerNames[i]].objects[i2].object_id == data.object_id) {
					this.players[playerNames[i]].objects[i2] = data
				}
			}
		}
	}
	
	initSocket(socket) {
        var self = this
		console.log("connection detected")

        socket.inited = false
		socket.on("syncronization event", function(data) {
			self.syncEvent(socket, data["user_id"], data)
        })
        socket.on("object changed", function(data) {
            self.registerObject(socket, data)
        })

		socket.emit("syncronization event callback")
	}

	syncEvent(socket, name, data) {
		var player = this.parseSyncData(data["data"])
		if (isVoid(this.players[name])) {
            setTimeout(function() {
                socket.emit("tts", {"say": "Hello " + name})
            }, 2000)

            socket.playerName = name

            player.leftController.object_id = this.generateId()
            player.rightController.object_id = this.generateId()
            player.objects = []
		}

        player.leftController.object_id = this.players[name].leftController.object_id
        player.rightController.object_id = this.players[name].rightController.object_id

		socket.broadcast.emit("object changed", {
			"object_id": player.leftController.object_id,
			"type": "sphere",
			"scaleX": "0.04500",
			"scaleY": "0.04500",
			"scaleZ": "0.04500",
			"posX": player.leftController.position.x,
			"posY": player.leftController.position.y,
			"posZ": player.leftController.position.z,
			"name": name+"LeftControllerNoGrab"
		})
		

		socket.broadcast.emit("object changed", {
			"object_id": player.rightController.object_id,
			"type": "sphere",
			"scaleX": "0.04500",
			"scaleY": "0.04500",
			"scaleZ": "0.04500",
			"posX": player.rightController.position.x,
			"posY": player.rightController.position.y,
			"posZ": player.rightController.position.z,
			"name": name+"RightControllerNoGrab"
		})
		
		
        player.socket = socket
		this.players[name] = player
    }

    parseSyncData(data) {
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
        user.head.position = {
            x: values[0][0],
            y: values[0][1],
            z: values[0][2]
        }
        user.head.rotation = {
            x: values[1][0],
            y: values[1][1],
            z: values[1][2],
            w: values[1][3]
        }
        user.rightController = {}
        user.rightController.position = {
            x: values[2][0],
            y: values[2][1],
            z: values[2][2]
        }
        user.rightController.rotation = {
            x: values[3][0],
            y: values[3][1],
            z: values[3][2],
            w: values[3][3]
        }
        user.leftController = {}
        user.leftController.position = {
            x: values[4][0],
            y: values[4][1],
            z: values[4][2]
        }
        user.leftController.rotation = {
            x: values[5][0],
            y: values[5][1],
            z: values[5][2],
            w: values[5][3]
        }

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

module.exports = function () {
    return new AVROS()
}