class O {
	constructor() {
		var self = this
		
        this.blackColor = 0x000000
		this.blackMaterial = new THREE.MeshBasicMaterial(
            { color: this.blackColor }
        )
        this.whiteColor = 0xffffff
		this.whiteMaterial = new THREE.MeshBasicMaterial(
            { color: this.whiteColor }
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

		o.sync = true
		o.grabbable = true

		o.name = blackOrWhite + "" + o.id+ "Sync"
		
		

        return o
	}
}