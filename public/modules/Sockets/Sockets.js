class Sockets extends OSModule {
	init() {
		console.log("initing sockets")
		this.playerName = "webClient"
		var query = window.location.search.substring(1);
		var qs = parse_query_string(query);
		
		if (!isVoid(qs)) {
			if(!isVoid(qs.playerName)) {
				this.playerName = qs.playerName
				console.log("player name is "+ this.playerName)
				
			}
		}
		
		var self = this
		
		this.objectMap = []
		
		this.socket = io()
		this.socket.connect('http://localhost:9774');
				
		this.socket.on("connection accepted", function(){
			self.objectMap = []
			
			console.log("client: connected")
		})
		
		this.socket.on("disconnect", function(){
			setTimeout(function(){ 
				self.socket.connect('http://localhost:9774');
			}, 1000)
			
		})
		
		this.socket.on("who are you", function(){
			
			self.socket.emit("i am", {
				"playerName": self.playerName
			})
			
		})
		
		
		this.socket.on("object changed", function(data) {
			self.objectUpdate(data)
		})
		
		this.socket.on("syncronization event callback", function(){
			console.log("client: sync")
			if (!isVoid(this.syncTimeout)) {
				clearTimeout(this.syncTimeout)
			}
			this.syncTimeout = setTimeout(function() {
				console.log("connection timeout")
				
			}, 5000)
			self.socket.emit("syncronization event", {
				"user_id": self.playerName,
				"data": "("
					+ OS.camera.position.x + ", "
					+ OS.camera.position.y + ", "
					+ OS.camera.position.z + ")|("
					
					+ OS.camera.quaternion._x + ", "
					+ OS.camera.quaternion._y + ", "
					+ OS.camera.quaternion._y + ", "
					+ OS.camera.quaternion._w + ")|("
					
					+ controller.sphere[0].position.x + ", "
					+ controller.sphere[0].position.y + ", "
					+ controller.sphere[0].position.z + ")|("
					
					+ controller.sphere[0].quaternion._x + ", "
					+ controller.sphere[0].quaternion._y + ", "
					+ controller.sphere[0].quaternion._z + ", "
					+ controller.sphere[0].quaternion._w + ")|("
					
					+ controller.sphere[1].position.x + ", "
					+ controller.sphere[1].position.y + ", "
					+ controller.sphere[1].position.z + ")|("
					
					+ controller.sphere[1].quaternion._x + ", "
					+ controller.sphere[1].quaternion._y + ", "
					+ controller.sphere[1].quaternion._z + ", "
					+ controller.sphere[1].quaternion._w + ")|"
					
					+ controller.sphere[0].id + "|"
					+ controller.sphere[1].id
			})
			
			self.mapExisting()
		})
	}
	
	objectUpdate(props) {
		
		var obj = OS.scene.getObjectByName( props.name, true );
		
		if (isVoid(obj)) {
			if (!isVoid(props.type)) {
				if (props.type == "cube") {
					var geometry = new THREE.BoxGeometry( 
						parseFloat(props.scaleX), 
						parseFloat(props.scaleY), 
						parseFloat(props.scaleZ)
					)
					var material = new THREE.MeshBasicMaterial( {color: 0xffffff, transparent: true, opacity: 1} )
					obj = new THREE.Mesh( geometry, material )
					OS.scene.add( obj )
				} else if (props.type == "sphere") {
					console.log("created")
					var geometry = new THREE.SphereGeometry( 40/1000, 32/1000, 16/1000 );
					var material = new THREE.MeshBasicMaterial( {color: 0xffffff, transparent: true, opacity: 1})
					obj = new THREE.Mesh( geometry, material )
					OS.scene.add( obj )
					
					controller.grabbableObjects.push(obj)
				} else if (props.type == "o") {
					obj = o.add(obj)
				} else {
					return
				}
			} else {
				return
			}
		}
		
		
		if (!isVoid(props.posX)) {
			obj.position.fromArray([
				parseFloat(props.posX), 
				parseFloat(props.posY), 
				parseFloat(props.posZ)
			])
		}
		
		if (!isVoid(props.scaX)) {
			obj.scale.fromArray([
				parseFloat(props.scaX), 
				parseFloat(props.scaY), 
				parseFloat(props.scaZ)
			])
		}
		
		if (!isVoid(props.rotX)) {
			obj.quaternion.fromArray([
				parseFloat(props.rotX), 
				parseFloat(props.rotY), 
				parseFloat(props.rotZ), 
				parseFloat(props.rotW)
			])
		}
		
		if (!isVoid(props.colorR)) {
			obj.material.color.r = parseInt(props.colorR);
			obj.material.color.g = parseInt(props.colorG);
			obj.material.color.b = parseInt(props.colorB);
		}
		
		if (!isVoid(props.transparency)) {
			obj.material.opacity = parseFloat(props.transparency);
		}
		
		obj.name = props.name
	}
	
	isSimilar(obj1, obj2) {
		var keys = Object.keys(obj1)
		for (var i = 0; i < keys.length; i ++) {
			if (isVoid(obj2[keys[i]])) {
				return false
			}
			if (obj1[keys[i]] != obj2[keys[i]]) {
				return false
			}
		}
		return true
	}
	
	toSocketJSON(obj) {
		var type = ""
        if (obj.name.search("oOo") != -1) {
			type = "o"
        } else if (obj.geometry.type == "Geometry") {
            if (obj.geometry.boundingSphere !== null) {
                type = "sphere"
            }
        } else if (obj.geometry.type == "BoxGeometry") {
           type = "cube"
		}
		
		return {
			"type": type,
			"name": obj.name,
			"posX": obj.position.x,
			"posY": obj.position.y,
			"posZ": obj.position.z,
			"scaX": obj.scale.x,
			"scaY": obj.scale.y,
			"scaZ": obj.scale.z,
			"rotX": obj.quaternion._x,
			"rotY": obj.quaternion._y,
			"rotZ": obj.quaternion._z,
			"rotW": obj.quaternion._w,
			"object_id": obj.id,
			"parent": obj.parent.id,
			"colorR": obj.material.color.r,
			"colorG": obj.material.color.g,
			"colorB": obj.material.color.b,
			"transparency": obj.material.opacity
		}
	}
	
	newName(name) {
		this.playerName = name
		this.socket.emit("name changed", {"playerName": name})
	}
	
	mapExisting() {
		objList = []
		allSceneObjects(OS.scene)
		
		
		for(var i = 0; i < objList.length; i ++) {
			if (!isVoid(objList[i].sync)) {
				var socketObj = this.toSocketJSON(objList[i])
				
				var found = false
				for (var i2 = 0; i2 < this.objectMap.length; i2 ++) {
					if (this.objectMap[i2].object_id == socketObj.object_id) {
						if (!this.isSimilar(socketObj, this.objectMap[i2])) {
							this.objectMap[i2] = socketObj
							this.socket.emit("object changed", socketObj)
						}
						found = true
					}
				}
				
				if (!found) {
					this.objectMap.push(socketObj)
					this.socket.emit("object changed", socketObj)
				}
			}
		}
		
	}
}

var objList = []
function allSceneObjects(scene) {
	for (var i = 0; i < scene.children.length; i ++) {
		allSceneObjects(scene.children[i])
		objList.push(scene.children[i])
	}
}

function parse_query_string(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    var key = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);
    // If first entry with this name
    if (typeof query_string[key] === "undefined") {
      query_string[key] = decodeURIComponent(value);
      // If second entry with this name
    } else if (typeof query_string[key] === "string") {
      var arr = [query_string[key], decodeURIComponent(value)];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(decodeURIComponent(value));
    }
  }
  return query_string;
}

