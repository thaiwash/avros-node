class Sockets extends OSModule {
	init() {
		console.log("initing sockets")
		var playerName = "webClient"
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
				"playerName": playerName
			})
			
		})
		
		
		this.socket.on("object changed", function(data) {
			self.objectUpdate(data)
		})
		
		this.socket.on("syncronization event callback", function(){
			console.log("client: sync")
			self.mapExisting()
			self.socket.emit("syncronization event", {
				"user_id": playerName,
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
		})
	}
	
	objectUpdate(props) {
		var obj = OS.scene.getObjectById( props.object_id, true );
		
		if (!isVoid(obj)) {
			if (obj.type == "cube") {
				var geometry = new THREE.BoxGeometry( 
					parseFloat(props.scaleX), 
					parseFloat(props.scaleY), 
					parseFloat(props.scaleZ)
				)
				var material = new THREE.MeshBasicMaterial( {color: 0xffffff} )
				obj = new THREE.Mesh( geometry, material )
				obj.add( cube )
			} 
			
			if (type == "sphere") {
				var geometry = new THREE.SphereGeometry( 
					parseFloat(obj.scaleX), 
					parseFloat(obj.scaleY), 
					parseFloat(obj.scaleZ)
				)
				var material = new THREE.MeshBasicMaterial( {color: 0xffffff} )
				obj = new THREE.Mesh( geometry, material )
				obj.add( sphere )
			}
		}
		
		if (isVoid(obj)) {
			return
		}
		
		obj.position = new THREE.Vector3(
			parseFloat(props.posX), 
			parseFloat(props.posY), 
			parseFloat(props.posZ)
		)
		
		obj.scale = new THREE.Vector3(
			parseFloat(props.scaleX), 
			parseFloat(props.scaleY), 
			parseFloat(props.scaleZ)
		)
		
		obj.quaternion = new THREE.Quaternion(
			parseFloat(props.rotX), 
			parseFloat(props.rotY), 
			parseFloat(props.rotZ), 
			parseFloat(props.rotW)
		)
		
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
        if (obj.geometry.type == "Geometry") {
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
			"rotX": obj.quaternion._x,
			"rotY": obj.quaternion._y,
			"rotZ": obj.quaternion._z,
			"rotW": obj.quaternion._w,
			"object_id": obj.id,
			"parent": obj.parent.id
		}
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
