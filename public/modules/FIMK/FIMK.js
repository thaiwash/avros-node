class FIMK {
	init() {
		return;
		var self = this
        window.addEventListener('buttonpressed', function (e) {
			
			if (e.detail.button == "R_JOYSTICK") {
				self.spawn()
				/*var obj = controller.grabbedObject(0);
				if (spheres.isSphere(obj) ) {
					polygon.fromObjectGroup(spheres.getGroup(obj));
				}*/
				
			}
        })
		setTimeout(function() {
			self.awake()
		}, 1000)
	}
	
	awake(){
		this.spawn()
	}
	
	spawn() {
		var geometry = new THREE.BoxGeometry( 0.5, 0.7, 0.2 );
		var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
		var cube = new THREE.Mesh( geometry, material );
		cube.position.copy(OS.defaultLocation())
		cube.grabbable = true;
		controller.grabbableObjects.push(cube)
		OS.scene.add( cube );
	}
}