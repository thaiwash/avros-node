class TextLoader {
	init() {
		//this.frontSphere = spheres.add(OS.camera.position)
		//OS.camera.add(this.frontSphere)
		//this.frontSphere.position.set(-0.2,0.1,-0.5)
		//console.log("init")
		
		//textLoader.load('socket.emit("load project", {"file": "public/save/sphere.json"})', Util.getMatrixPosition(textLoader.frontSphere))
		//textLoader.load("controller.getGrabbedObject(0)", Util.getMatrixPosition(textLoader.frontSphere))
		
		//spawnLocation.y -= 0.10
		//OS.scene.updateMatrixWorld()
		//var spawnLocation = headText.spawningLocation()
		//textLoader.load("lazer.pen()", spawnLocation)
		//textLoader.load("fs.load()", spawnLocation)
		//this.load("modelLoader.loadSTL('krat.stl')", Util.getMatrixPosition(this.frontSphere))
		//	OS.scene.updateMatrixWorld()
		//headText.detachSpheres();
		//this.load("Execute('ls')")spawningQuaternion
		//spawnLocation.y -= 0.10
		//OS.scene.updateMatrixWorld()
		//textLoader.load("textGeometry.lookAt( OS.camera.position );", spawnLocation)
		//textLoader.load("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,()[]{};:=!?/*$#@_-+|&><\"", spawnLocation)
		/*
		var self = this;
        window.addEventListener('buttonpressed', function (e) {
			if (e.detail.button == "R_GRIP") {
				var intersect = controller.intersectingFromArray(RIGHT, spheres.getGroup(OS.camera.children[1]))
				console.log("realization " )
				if (intersect) {
					console.log("realization event trigger")
					self.detachSpheres(intersect)
					var group = [];
					for (var i = 0; i < OS.camera.children.length; i ++) {
						if (spheres.isSphere(OS.camera.children[i])) {
							group.push(OS.camera.children[i]);
						}
					}
					spheres.linkGroup(group)
				
				}
			}
        })*/
	}
	
	
	detachSpheres(grabbedSphere) {
		for (var i = 0; i < OS.camera.children.length; i ++) {
			if (spheres.isSphere(OS.camera.children[i])) {
				THREE.SceneUtils.detach(
					OS.camera.children[i],
					OS.camera,
					OS.scene
				)
				this.detachSpheres(grabbedSphere)
				return
			}
		}
		
		setTimeout(function() {
			controller.grab(0)
		}, 0)
	}
	
	load(_text, _inherit) {
		if (typeof _inherit == "undefined") {
			_inherit = {}
			_inherit.position = OS.defaultLocation()
			_inherit.quaternion = OS.defaultQuaternion()
		} else {
			if (typeof _inherit.position == "undefined") {
				_inherit.position = OS.defaultLocation()
			}
			if (typeof _inherit.quaternion == "undefined") {
				_inherit.quaternion = OS.defaultQuaternion()
			}
		}
		
		var lastTextSphere = null;
		for (var i = 0; i < _text.length; i ++) {
			
			var textSphere = spheres.add(_inherit.position, _text.charAt(i), undefined, _inherit.quaternion)
			
			
			OS.scene.updateMatrixWorld()
			THREE.SceneUtils.attach(textSphere, OS.scene, OS.defaultObject())
			textSphere.position.x += (0.05*(i));
			textSphere.position.x -= 0.5;
			OS.scene.updateMatrixWorld()
			THREE.SceneUtils.detach(textSphere, OS.defaultObject(), OS.scene)
			OS.scene.updateMatrixWorld()
			
			if (lastTextSphere != null) {
				spheres.link(textSphere, lastTextSphere)
			}
			//textSphere.quaternion.copy(OS.camera.quaternion)
			lastTextSphere = textSphere;
		}			
		OS.scene.updateMatrixWorld()
		//lastTextSphere = spheres.getFirst(lastTextSphere)
		lastTextSphere.scale.x = lastTextSphere.scale.x*0.1;
		lastTextSphere.scale.y = lastTextSphere.scale.y*0.1;
		lastTextSphere.scale.z = lastTextSphere.scale.z*0.1;
		return lastTextSphere;
	}
	extract(sphere) {
		console.log(spheres.getGroupText(spheres.spheres[2]))
		compiler.compile(spheres.getGroup(spheres.spheres[2]));
	}
}