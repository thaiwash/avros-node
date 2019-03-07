class Sockets extends OSModule {
	init() {
		console.log("initing sockets")
		this.playerName = "webClient"
		this.spectate("Taivas")
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
		// if child was registered before parent, obj may become orphsn
		this.orphanObjects = []
		
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
		
		this.socket.on("object destroyed", function(data) {
			self.destroyObject(data)
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
	
	destroyObject(obj) {
		var obj = this.getObjectBySyncId( obj.syncProps.object_id );
		console.log(props.name + " destroyed")
		obj.parent.remove(obj)
	}
	
	spectate(playerName) {
		this.spectating = playerName
	}
	
	observerCheck(obj) {
		if (isVoid(obj.syncProps.name)) {
			return
		}
		if (isVoid(obj.syncProps.owner)) {
			return
		}
		if (obj.syncProps.name == "PlayerCamera" && obj.syncProps.owner == this.spectating) {
			OS.camera.position.copy(obj.position)
			//OS.camera.rotation.copy(this.applyUnityRotation(obj.syncProps))
			console.log("spectating Taivas")
		}
	}
	
	applyUnityRotation(props){
		var q = new THREE.Quaternion( 
			-(parseFloat(props.rotX)), 
			(parseFloat(props.rotY)), 
			(parseFloat(props.rotZ)), 
			-(parseFloat(props.rotW)) 
		);

		var v = new THREE.Euler();  
		v.setFromQuaternion( q );

		//v.y += Math.PI; // Y is 180 degrees off

		v.z *= -1; // flip Z

		return v;
	}
	
	objectUpdate(props) {
		
		var obj = this.getObjectBySyncId( props.object_id );
		
		var wasCreated = false
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
					obj.isCube = true
					wasCreated = true
				} else if (props.type == "sphere") {
					console.log("created")
					var geometry = new THREE.SphereGeometry( 40/1000, 32/1000, 16/1000 );
					var material = new THREE.MeshBasicMaterial( {color: 0xffffff, transparent: true, opacity: 1})
					obj = new THREE.Mesh( geometry, material )
					OS.scene.add( obj )
					obj.isSphere = true
					wasCreated = true
					
					controller.grabbableObjects.push(obj)
				} else if (props.type == "plane") {
					var geometry = new THREE.PlaneGeometry( 
						parseFloat(props.scaleX), 
						parseFloat(props.scaleY), 
						parseFloat(props.scaleZ)
					);
					var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
					obj = new THREE.Mesh( geometry, material );
					OS.scene.add( obj );
					obj.isPlane = true
					wasCreated = true
				} else if (props.type == "empty") {
					var geometry = new THREE.SphereGeometry( 40/1000, 32/1000, 16/1000 );
					var material = new THREE.MeshBasicMaterial( {color: 0xffffff, transparent: true, opacity: 1})
					obj = new THREE.Mesh( geometry, material )
					OS.scene.add( obj )
					obj.isEmpty = true
					obj.visible = false
					wasCreated = true
					
					controller.grabbableObjects.push(obj)
				}
			} else {
				
			}
		}
		
		obj.syncProps = props
		
		if (!isVoid(props.parent)) {
			var parent = this.getObjectBySyncId( props.parent );
			if (isVoid(parent)) {
				console.log("object "+props.name+" "+props.object_id+" has no parent in scene")
				obj.visible = false
				this.orphanObjects.push(obj)
			} else {
				THREE.SceneUtils.attach(obj, OS.scene, parent)
			}
		} else if (obj.parent.id != OS.scene.id) {
			THREE.SceneUtils.detach(obj, obj.parent, OS.scene)
		}
		
		this.scanForAdoption(obj)
		
		this.updateMainProperties(obj)
		
		if (!isVoid(props.colorR)) {
			obj.material.color.r = parseInt(props.colorR);
			obj.material.color.g = parseInt(props.colorG);
			obj.material.color.b = parseInt(props.colorB);
		}
		
		if (!isVoid(props.transparency)) {
			obj.material.opacity = parseFloat(props.transparency);
		}
		
		obj.name = props.name
		obj.name = props.name
		obj.syncID = props.object_id
		
		
		
		
		this.updateSyncProps(obj)
		this.socket.emit("object registered", obj.syncProps)
		
		this.observerCheck(obj)
		
		
	}
	
	scanForAdoption(obj) {
		if (isVoid(obj.syncProps.parent)) {
			return
		}
		for (var i = 0; i < this.orphanObjects.length; i ++) {
			if (obj.syncProps.object_id == this.orphanObjects[i].syncProps.parent) {
				console.log(this.orphanObjects[i].syncProps.name + " orphan object was adopted by "+obj.syncProps.name)
				THREE.SceneUtils.attach(this.orphanObjects[i], OS.scene, obj)
				
				this.updateMainProperties(this.orphanObjects[i])
				this.orphanObjects[i].visible = true
				this.orphanObjects.splice(i, 1)
				i = 0
			}
		}
	}
	
	updateMainProperties(obj) {
		
		if (!isVoid(obj.syncProps.posX)) {
			obj.position.fromArray([
				parseFloat(obj.syncProps.posX), 
				parseFloat(obj.syncProps.posY), 
				parseFloat(obj.syncProps.posZ)
			])
		}
		
		if (!isVoid(obj.syncProps.scaX)) {
			obj.scale.fromArray([
				parseFloat(obj.syncProps.scaX), 
				parseFloat(obj.syncProps.scaY), 
				parseFloat(obj.syncProps.scaZ)
			])
		}
		
		if (!isVoid(obj.syncProps.rotX)) {
			obj.quaternion.fromArray([
				parseFloat(obj.syncProps.rotX), 
				parseFloat(obj.syncProps.rotY), 
				parseFloat(obj.syncProps.rotZ), 
				parseFloat(obj.syncProps.rotW)
			])
		}
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
	
	updateSyncProps(obj) {
		if (isVoid(obj.syncProps)) {
			return
		}
		/*
		var type = ""
		
		if (!isVoid(obj.isSphere)) {
			type = "sphere"
		} else if (!isVoid(obj.isCube)) {
			type = "cube"
		} else if (!isVoid(obj.isPlane)) {
			type = "plane"
		} else if (!isVoid(obj.isEmpty)) {
			type = "empty"
		}
		
		if (type == "") {
			if (obj.name.search("oOo") != -1) {
				type = "o"
			} else if (obj.geometry.type == "Geometry") {
				if (obj.geometry.boundingSphere !== null) {
					type = "sphere"
				}
			} else if (obj.geometry.type == "BoxGeometry") {
			   type = "cube"
			}
		}*/
		
		
		obj.syncProps.name = obj.name
		obj.syncProps.posX = obj.position.x
		obj.syncProps.posY = obj.position.y
		obj.syncProps.posZ = obj.position.z
		obj.syncProps.scaX = obj.scale.x
		obj.syncProps.scaY = obj.scale.y
		obj.syncProps.scaZ = obj.scale.z
		obj.syncProps.rotX = obj.quaternion._x
		obj.syncProps.rotY = obj.quaternion._y
		obj.syncProps.rotZ = obj.quaternion._z
		obj.syncProps.rotW = obj.quaternion._w
		
		obj.syncProps.colorR = obj.material.color.r
		obj.syncProps.colorG = obj.material.color.g
		obj.syncProps.colorB = obj.material.color.b
		
		obj.syncProps.transparency = obj.material.opacity
		
		
		
		return obj.syncProps
	}
	
	newName(name) {
		this.playerName = name
		this.socket.emit("name changed", {"playerName": name})
	}
	
	getObjectBySyncId(id) {
		objList = []
		allSceneObjects(OS.scene)
		for(var i = 0; i < objList.length; i ++) {
			if (!isVoid(objList[i].syncID)) {
				if (objList[i].syncID == id) {
					return objList[i];
				}
			}
		}
	}
	
	mapExisting() {
		objList = []
		allSceneObjects(OS.scene)
		
		
		for(var i = 0; i < objList.length; i ++) {
			if (!isVoid(objList[i].sync)) {
				var socketObj = this.updateSyncProperties(objList[i])
				
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

