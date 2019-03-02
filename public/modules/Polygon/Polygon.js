class Polygon {
	
	init() {
		//console.log("here")
		setTimeout(function() {
		//console.log("here2")
			//textLoader.load("save.load()", OS.defaultLocation());
			textLoader.load("polygon.generate()", OS.defaultLocation());
			//textLoader.load("save.save()", OS.defaultLocation());
		}, 5000)
	}
	
	generate() {
		var obj = controller.getGrabbedObject(1);
		if (obj == null) {
			headText.add("You need to be grabbing a sphere group")
			return
		}
		if (spheres.isSphere(obj)) {
			this.fromSphere(obj)
		}
	}
	

	fromSphere(obj) {
		var objectGroup	= spheres.getGroup(obj)
		var dots = [];
		
		for (var i = 0; i < objectGroup.length; i ++) {
			dots.push(getMatrixPosition(objectGroup[i]));
		}
		
		
		var geo = new THREE.Geometry();
		 var mat = new THREE.MeshBasicMaterial();
		 //var middlePoint = new THREE.Vector3(0,0,0);
		 for(var i=0;i<dots.length;i++){
			//middlePoint.add(dots[i].position) 
			geo.vertices.push(new THREE.Vector3(dots[i].x,dots[i].y,dots[i].z));
		 }
		 //middlePoint.divideScalar(dots.length);
		 //geo.vertices.push(middlePoint);

		 for(var i=0;i<dots.length-2;i++){
			//middlePoint.add(dots[i].position) 
			geo.faces.push(new THREE.Face3( i, i+1, i+2));
			
		 }
		 
		 mat.side = THREE.DoubleSide;
		 mat.opacity = 0.1;
		 mat.transparent = true;

		if (typeof this.mesh !== "undefined") {
			OS.scene.remove(this.mesh)
		}
		this.mesh = new THREE.Mesh(geo,mat);
		OS.scene.add(this.mesh)
		//this.mesh.position.copy(getMatrixPosition(objectGroup[0].position));
		//this.mesh.rotation.copy(getMatrixRotation(objectGroup[0].rotation));
		
		var self = this
		this.interval = setTimeout(function() {
			self.fromSphere(obj)
		}, 100)
		return this.mesh;
	}
	
	test() {
		var geometry = new THREE.Geometry();
		var size = 0.5
		geometry.vertices.push(
			new THREE.Vector3( -size,  size, 0 ),
			new THREE.Vector3( -size, -size, 0 ),
			new THREE.Vector3(  size, -size, 0 )
		);

		geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

		geometry.computeBoundingSphere();
		
		//geometry.position.copy(OS.defaultPosition())
		
		//OS.scene
	}
}