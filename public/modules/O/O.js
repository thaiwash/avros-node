class O {
	constructor() {
		var self = this
		this.intersecting = [false, false]
		
        this.blackColor = 0x000000
		this.blackMaterial = new THREE.MeshBasicMaterial(
            { color: this.blackColor, transparent: true, opacity: 0.5 }
        )
        this.whiteColor = 0xffffff
		this.whiteMaterial = new THREE.MeshBasicMaterial(
            { color: this.whiteColor, transparent: true, opacity: 0.5 }
        )
		
        window.addEventListener('buttonpressed', function (e) {
            if (e.detail.button == "A" && controller.buttonPressed['B']) {
				var sphere = self.add(true, controller.sphere[0].position)
				headText.add("White sphere added "+sphere.name)
            }
			
            if (e.detail.button == "B" && controller.buttonPressed['A']) {
				var sphere = self.add(false, controller.sphere[0].position)
				headText.add("Black sphere added "+sphere.name)
            }
			
			if (e.detail.button == "X") {
					console.log(controller.isGrabbing(RIGHT))
					console.log(controller.isGrabbing(LEFT))
                if (controller.isGrabbing(RIGHT) && controller.isGrabbing(LEFT)) {
					console.log(controller.getGrabbedObject(LEFT))
					console.log(controller.getGrabbedObject(RIGHT))
					headText.add(
						"merged: " + controller.getGrabbedObject(LEFT).name + " and " + controller.getGrabbedObject(RIGHT).name
					)
					
					// detach from controller	
		
					var o1 = controller.getGrabbedObject(RIGHT);
					var o2 = controller.getGrabbedObject(LEFT);
					
					controller.unGrab(LEFT)
					controller.unGrab(RIGHT)
					
					self.merge(
                        o1,
                        o2
                    )
					
					
					controller.grab(LEFT)
                }

            }
		})
		
		
		window.addEventListener('controllerupdate', function (e) {
		    var intersectingNow = controller.intersectingFromArray(
                e.detail.rightOrLeft,
				self.oo
            )
		    if (intersectingNow) {
				intersectingNow.material.opacity = 0.8
				
				// selecting
				//console.log("inters")
				if(controller.buttonPressed["L_TRIGGER"] 
					&& e.detail.rightOrLeft == LEFT 
					|| controller.buttonPressed["R_TRIGGER"] 
					&& e.detail.rightOrLeft == RIGHT) {
					//console.log("inters2")
					self.select(intersectingNow)
				}
						
				// started intersecting another
                if (self.intersecting[e.detail.rightOrLeft]) {
                    if (self.intersecting[e.detail.rightOrLeft].uuid
                        != intersectingNow.uuid
                    ) {
                        self.intersecting[
                            e.detail.rightOrLeft
                        ].material.opacity = 0.5
                    }
                }
                self.intersecting[e.detail.rightOrLeft] = intersectingNow
		    } else {
                if (self.intersecting[e.detail.rightOrLeft]) {
                    self.intersecting[
                        e.detail.rightOrLeft
                    ].material.opacity = 0.5
                    self.intersecting[e.detail.rightOrLeft] = false
                }
            }
        })
		
		this.oo = []
		this.shape =  new THREE.SphereGeometry( 40/1000, 32/1000, 16/1000 );

    }
	
	init() {
		//po.buffer("code")
	}
	
    add(blackOrWhite, position) {
		
		var o = new THREE.Mesh( 
			this.shape.clone(), 
			blackOrWhite ? 
				this.whiteMaterial.clone() : 
				this.blackMaterial.clone() 
		)
		
		if (typeof position !== "undefined") {
		    if (typeof position[0] !== "undefined") {
                o.position.fromArray(position)
			} else {
                o.position.fromArray([position.x, position.y, position.z])
            }
		}

		OS.scene.add( o );


		o.name = blackOrWhite + "" + o.id+ "oOoSync"
		
		
		o.sync = true
		o.grabbable = true
		this.oo.push(o)
		controller.grabbableObjects.push(o)

        return o
	}
	
	
	merge(o1, o2) {
		var name1;
		var name2;
        if (typeof o1 === "undefined") {
            console.warn("sphere1 is undefined")
            return false
        }
        if (typeof o2 === "undefined") {
            console.warn("sphere2 is undefined")
            return false
        }
        if (o1 == null) {
            console.warn("broken link "+ name1)
            return false
		}
        if (o2 == null) {
            console.warn("broken link "+ name2)
            return false
		}
		
		OS.scene.updateMatrixWorld();
		var pos1 = new THREE.Vector3();
		pos1.setFromMatrixPosition( o1.matrixWorld );
		
		var pos2 = new THREE.Vector3();
		pos2.setFromMatrixPosition( o2.matrixWorld );
		
				
		var dir = new THREE.Vector3().subVectors(pos1, pos2);

		dir.normalize();

		var origin = pos2
		var length = pos1.distanceTo(pos2)
		var hex = 0x00ff00;

		var arrow = new THREE.ArrowHelper( dir, origin, length, hex );
		//arrow.visible = false
		OS.scene.add( arrow );

		//textGeometry.lookAt( OS.camera.position );
		// git clone https://thaiwash@bitbucket.org/thaiwash/avrose.git
		OS.scene.updateMatrixWorld();
		
		THREE.SceneUtils.attach(arrow, OS.scene, o1)
		THREE.SceneUtils.attach(o2, OS.scene, o1)

        return true
    }
}