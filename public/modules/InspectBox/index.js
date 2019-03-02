class InspectBox extends OSModule {
	init() {
		var self = this
		this.loadJS("/modules/InspectBox/lib/OrbitControls.js", function() {
			//OS.camera.position.set( 100, 200, 300 );
			//console.log("init orbit controls")
			self.initInspectBox()
		})
	}
	
	
	update() {
		if (typeof this.scene !== "undefined") {
			this.controls.update();
			//console.log("update controls "+this.scene+", "+this.camera)
			this.inspectboxRenderer.render( this.scene, this.camera );
		}
	}
	
	review(object) {
		//console.log(object)
		this.scene.remove(this.scene.children[2])
		this.scene.add(object)
	}
	
	initInspectBox() {
		this.inspectbox = document.createElement( 'div' );
		this.inspectbox.id = "inspectbox"
		document.body.appendChild( this.inspectbox );

		this.inspectboxText = document.createElement( 'div' );
		this.inspectboxText.innerText = "";
		this.inspectbox.appendChild( this.inspectboxText );

		this.inspectboxButtons = document.createElement( 'div' );
		//this.inspectboxButtons.innerHTML = "<button onclick='back()'>Back</button><button onclick='next()'>Next</button><b id='childinfo'></b>";
		this.inspectbox.appendChild( this.inspectboxButtons );

		this.inspectboxRenderer = new THREE.WebGLRenderer( { antialias: true } );
		this.inspectboxRenderer.setPixelRatio( window.devicePixelRatio );
		this.inspectboxRenderer.setSize( window.innerWidth/4, window.innerHeight/4 );
		this.inspectboxRenderer.shadowMap.enabled = true;
		this.inspectbox.appendChild( this.inspectboxRenderer.domElement );
		this.inspectbox.style.position = "absolute";
		this.inspectbox.style.top = "100px";

		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
		this.camera.position.set( 100, 200, 300 );

		this.controls = new THREE.OrbitControls( this.camera );
		this.controls.target.set( 0, 100, 0 );
		this.controls.object = this.camera;
		this.controls.update();

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( 0x000000 );
		this.scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

		this.inspectboxLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
		this.inspectboxLight.position.set( 0, 200, 0 );
		this.scene.add( this.inspectboxLight );

		this.inspectboxLight = new THREE.DirectionalLight( 0xffffff );
		this.inspectboxLight.position.set( 0, 200, 100 );
		this.inspectboxLight.castShadow = true;
		this.inspectboxLight.shadow.camera.top = 180;
		this.inspectboxLight.shadow.camera.bottom = - 100;
		this.inspectboxLight.shadow.camera.left = - 120;
		this.inspectboxLight.shadow.camera.right = 120;
		this.scene.add( this.inspectboxLight );

		//this.scene.add(this.camera);

		var cube = new THREE.Mesh( new THREE.CubeGeometry( 200, 200, 200 ), new THREE.MeshNormalMaterial() );
		cube.position.y = 150
		// add the object to the scene
		this.scene.add( cube );
	}
}