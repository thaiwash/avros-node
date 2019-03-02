
class CanvasObject {
    constructor(config) {
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')
        this.size = 256
		this.config = config
        this.canvas.width = this.config.width
        this.canvas.height = this.config.height

        this.controllerWrapper()
		
		//this.createCanvasWindow()
    }
	
	createCanvasWindow() {
		var canvasDOM = document.createElement("div")
		canvasDOM.style.position = "absolute"
		canvasDOM.style.top = (this.config.y) + "px"
		canvasDOM.style.left = (this.config.x) + "px"
		console.info("Creating canvas window")
		canvasDOM.appendChild(this.canvas)
		document.body.appendChild(canvasDOM)
		this.update()
	}

    controllerWrapper() {
        var self = this
        window.addEventListener('buttonpressed', function (e) {
            if (e.detail.button == "R_JOYSTICK") {
                self.createObject(controller.controllerSphere[0].position)
            }
        })
    }

    createObject(position) {
        if (typeof position === "undefined") {
            position = new THREE.Vector3()
        } else {
            position = new THREE.Vector3(position.x, position.y, position.z)
        }

        this.texture = new THREE.Texture(this.canvas);

        var geometry = new THREE.BoxGeometry( 0.05, 0.25, 0.5 );
        //this.mathBox = new THREE.Box3( 0.05, 0.25, 0.5 );
        var material = [
            new THREE.MeshBasicMaterial({ map: this.texture }),
            new THREE.MeshBasicMaterial( { color: 0xffffff } ),
            new THREE.MeshBasicMaterial( { color: 0xffffff } ),
            new THREE.MeshBasicMaterial( { color: 0xffffff } ),
            new THREE.MeshBasicMaterial( { color: 0xffffff } ),
            new THREE.MeshBasicMaterial( { color: 0xffffff } )
        ]

        this.cvs = new THREE.Mesh( geometry, material );
        //cvs.name = "keyboard"
        this.cvs.position.copy(position)
        this.cvs.grabbable = true
        //this.mathBox = new THREE.Box3().setFromObject(this.cvs);
        //this.mathBox.setFromCenterAndSize(position, new THREE.Vector3( 0.05, 0.25, 0.5 ))
        scene.add( this.cvs );

        this.canvas.width = this.size * 0.5 * 4
        this.canvas.height = this.size * 0.25 * 4
    }

    update() {
        this.ctx.fillStyle = 'white'
	    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
	    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height)
		this.ctx.stroke();

        if (typeof this.texture !== "undefined") {
    	    this.texture.needsUpdate = true
        }
    }
}
