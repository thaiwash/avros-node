class Raycast {
	
	init() {
		this.raycaster = new THREE.Raycaster()
		this.material = new THREE.LineBasicMaterial({
			color: 0xff0000
		});

		this.geometry = new THREE.Geometry();
		this.geometry.dynamic = true
		
		this.raycasting = false
		
		this.geometry.vertices.push(
			new THREE.Vector3(0,0,0)
		);
		this.geometry.vertices.push(
			new THREE.Vector3(0,0,0)
		);
		
		this.line = new THREE.Line( this.geometry, this.material );
		OS.scene.add( this.line );
		
		this.casting = false
		this.raycastTarget = null
		
		this.mouse = new THREE.Vector2();
		
		var self = this
        window.addEventListener('grabend', function (e) {
			if (e.detail.rightOrLeft == 0) {
				self.stopCasting()
				self.casting = false
			}
		})
        window.addEventListener('controllerupdate', function (e) {
			if (self.casting) {
				self.castRay();
			}
		})
        window.addEventListener('entervr', function (e) {
			textLoader.load("lazer.pen()")
		})
		
		window.addEventListener( 'mousemove',function onMouseMove( event ) {

			// calculate mouse position in normalized device coordinates
			// (-1 to +1) for both components

			self.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			self.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			self.pickingRay()
		}, false );
	}
	
	// this function is called from script
	pen() {
		this.casting = true
		return this.castRay()
	}
	
	getLastLink(_obj) {
		//headText.add(_obj.name)
		for (var i = 0; i < spheres.links.length; i ++) {
			if (spheres.links[i].master == _obj.name) {
				return spheres.links[i]
			}
		}
		return null;
	}
	
	
	
	castRay() {
		
		var obj = controller.sphere[RIGHT].children[0];
		//var objGroup = spheres.getGroup(obj);
		
		// todo rename getFirst and getLast
		obj = spheres.getFirst(obj);
		//obj.material.color.set( 0xff0000 );
		this.link = this.getLastLink(obj)
		this.fromSphere = OS.scene.getObjectByName(this.link.slave, true)
		//this.fromSphere.material.color.set( 0x00ff00 );
		this.toSphere = obj
		
		OS.scene.updateMatrixWorld()
		var toSpherePos = getMatrixPosition(this.toSphere);
		var fromSpherePos = getMatrixPosition(this.fromSphere);
		

		var geometry = new THREE.Geometry();
		
		geometry.vertices.push(
			fromSpherePos
		);
		
		//this.geometry = new THREE.Geometry();
		//this.geometry.vertices[0] = getMatrixPosition(this.toSphere);
		
		//this.geometry.vertices[0] = getMatrixPosition(this.toSphere);7this.geometry.vertices.push(getMatrixPosition(this.toSphere));

		//this.geometry.vertices[0] = toSpherePos

		var dist = 100;
		var direction = new THREE.Vector3().subVectors(toSpherePos, fromSpherePos);
		direction.normalize();
		this.raycaster.set(fromSpherePos, direction, 0.05, 1000000)
		var intersects = this.raycaster.intersectObjects( OS.scene.children, true);
		var intersected = false
		
		for (var i = 0; i < intersects.length; i ++) {
			if (typeof intersects[i].object.raycastable === "undefined") {
				intersects.splice(i, 1)
				i = -1
			}
		}
		//console.log(intersects.length)
		for ( var i = 0; i < intersects.length; i++ ) {
			//console.log(intersects[i])
			if (intersects[ i ].distance > dist || intersects[ i ].distance < 0.05) {
			//console.log("blocked")
				continue;
			}
			//console.log(intersects[i])
			geometry.vertices.push(
				intersects[i].point
			);
			this.geometry.vertices.push(intersects[i].point);
			dist = intersects[ i ].distances
			intersected = true
			
			if (!this.raycasting) { 
				this.raycasting = true
				this.raycastTarget = intersects[i].object
				window.dispatchEvent(new CustomEvent('raycaststart', { detail: { object: intersects[i].object }}));
			} else {
				if (this.raycastTarget != null) {
					if (this.raycastTarget.id != intersects[i].object.id) {
						window.dispatchEvent(new CustomEvent('raycastend', { detail: { object: this.raycastTarget }}));
						window.dispatchEvent(new CustomEvent('raycaststart', { detail: { object: intersects[i].object }}));
					}
				}
				window.dispatchEvent(new CustomEvent('raycast', { detail: { object: intersects[i].object }}));
			}
		}
		
		if (geometry.vertices.length < 2) {
	
			var pointB = new THREE.Vector3();
			pointB.addVectors ( fromSpherePos, direction.multiplyScalar( dist ) );

			geometry.vertices.push( pointB );
			//this.geometry.vertices.push(pointB );
			
			this.geometry.vertices[1] = pointB;
			
			if (this.raycasting) {
				this.raycasting = false
				window.dispatchEvent(new CustomEvent('raycastend'));
			}
		}
		
		console.assert(typeof this.line !== "undefined")
		
		this.line.geometry.verticesNeedUpdate = true;
		this.line.needsUpdate = true;
		
		this.stopCasting()
		this.line = new THREE.Line( geometry, this.material );
		OS.scene.add( this.line );
		//
		return ""+dist
	}
	
	stopCasting() {
		if (typeof this.line !== "undefined") {
			OS.scene.remove(this.line);
		}
	}
	
	dispatchRaycastEvent(_object) {
		if (!this.raycasting) { 
			this.raycasting = true
			this.raycastTarget = _object
			window.dispatchEvent(new CustomEvent('raycaststart', { detail: { object: _object }}));
		} else {
			if (this.raycastTarget != null) {
				if (this.raycastTarget.id != _object.id) {
					window.dispatchEvent(new CustomEvent('raycastend', { detail: { object: this.raycastTarget }}));
					window.dispatchEvent(new CustomEvent('raycaststart', { detail: { object: _object }}));
				}
			}
			window.dispatchEvent(new CustomEvent('raycast', { detail: { object: _object }}));
		}
	}
	
	pickingRay() {
		// update the picking ray with the camera and mouse position
		this.raycaster.setFromCamera( this.mouse, OS.camera );

		// calculate objects intersecting the picking ray
		var intersects = this.raycaster.intersectObjects( OS.scene.children, true);

		for (var i = 0; i < intersects.length; i ++) {
			if (typeof intersects[i].object.raycastable === "undefined") {
				intersects.splice(i, 1)
				i = -1
			}
		}
		
		if (intersects.length == 0) {
			if (this.raycasting) {
				this.raycasting = false
				window.dispatchEvent(new CustomEvent('raycastend', { detail: { object: this.raycastTarget }}));
			}
		} else {
			var closest = intersects[0]
			for (var i = 0; i < intersects.length; i ++) {
				if (intersects[i].distance < closest.distance) {
					closest = intersects[i]
				}
			}
			this.dispatchRaycastEvent(closest.object) 
		}
	}
}