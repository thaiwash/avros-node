class ModelLoader extends OSModule {
    constructor() {
		super()
		var self = this
		
		this.loaded = false
		//this.loadSTL("krat.stl")
		this.loadJS("/modules/ModelLoader/loaders/inflate.min.js", function() {
			self.loadJS("/modules/ModelLoader/loaders/TGALoader.js", function() {
				self.loadJS("/modules/ModelLoader/loaders/STLLoader.js", function() {
					self.loadJS("/modules/ModelLoader/loaders/FBXLoader.js", function() {
						self.loaded = true
					});
				});
			});
		});
		
        window.addEventListener('buttonpressed', function (e) {
            
        })
		
        window.addEventListener('buttonpressed', function (e) {
        })
        window.addEventListener('keypress', function (e) {
			//console.log(e.key)
        })
    }
	
	loadFBX(_file, _callback) {
		if (!this.loaded) {
			console.warn("trying to load before loaders have loaded")
			var self = this
			this.timer = setTimeout(function(){
				self.loadFBX(_file, _callback)
			}, 100)
			return;
		}
		var loader = new THREE.FBXLoader();
		loader.load( _file, function ( object ) {
			OS.defaultLocation()
			object.position.copy(OS.defaultLocation())
			object.scale.x = object.scale.x * 0.001
			object.scale.y = object.scale.y * 0.001
			object.scale.z = object.scale.z * 0.001
			OS.scene.add( objects );
			
			_callback(object)
		});
	}
	
    loadSTL(file, inheritProperties) {
		if (typeof inheritProperties == "undefined") {
			inheritProperties = {
				"position": headText.spawningLocation()
			}
		}
        var filename='models/'+file;  
        var loader = new THREE.STLLoader();
		console.log("Starting to load STL "+ filename);
		loader.load( filename, function ( geometry ) {
			console.log("Load STL "+ filename);
			var material = new THREE.MeshPhongMaterial( { color: 'green', specular: 0x111111, shininess: 100 } );
			//texture = new THREE.TextureLoader().load( cratetexture );
			//material = new THREE.MeshPhongMaterial( { map: texture} );
			var mesh = new THREE.Mesh( geometry, material );
			mesh.position.set(0,0,0);
			if (typeof inheritProperties !== "undefined") {
				if (typeof inheritProperties.position !== "undefined") {
					mesh.position.copy(inheritProperties.position);
				}
				//spheres.add%%€€9
			}
			
			mesh.scale.set(0.2, 0.2, 0.2);
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			mesh.name = "krat";
			//mesh.add (addLogo(100,200,0,'logo1'));
			//mesh.add (addLogo(100,200,298,'logo2'));
			//console.log("Create "+ mesh);
			OS.scene.add( mesh );
			inspectBox.review( mesh );
		});
    }
	
    loadJSONObject(_file, _callback, _inheritProperties) {
		if (typeof _file === "undefined") {
			_file = "modules/ModelLoader/models/try_this.json"
		}
		
		if (typeof _inheritProperties === "undefined") {
			_inheritProperties = {}
		}
		
		if (typeof _inheritProperties.position === "undefined") {
			_inheritProperties.position = headText.spawningLocation()
		}
		
		var loader = new THREE.ObjectLoader();

		loader.load(
			// resource URL
			_file,

			// onLoad callback
			// Here the loaded data is assumed to be an object
			function ( obj ) {
				// Add the loaded object to the scene
				if (typeof _callback === "function") {
					_callback(obj)
				} else {
					var scale = 0.01
					obj.scale.x = obj.scale.x * scale
					obj.scale.y = obj.scale.y * scale
					obj.scale.z = obj.scale.z * scale
					obj.position.copy(_inheritProperties.position)
					OS.scene.add( obj );
				}
			},

			// onProgress callback
			function ( xhr ) {
				console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
			},

			// onError callback
			function ( err ) {
				console.error( 'An error happened' );
			}
		);


	}
	
    loadJSON(_file, _inheritProperties) {
		
		if (typeof _file === "undefined") {
			_file = "modules/ModelLoader/models/test.json"
		}
		
		if (typeof _inheritProperties === "undefined") {
			_inheritProperties = {}
		}
		
		if (typeof _inheritProperties.position === "undefined") {
			_inheritProperties.position = headText.spawningLocation()
		}
			
		var loader = new THREE.JSONLoader();

		loader.load( _file, function( geometry ) {
			var mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial() );
			console.log(mesh)
			mesh.position.copy(_inheritProperties.position)
			mesh.scale.x = mesh.scale.x * 0.001
			mesh.scale.y = mesh.scale.y * 0.001
			mesh.scale.z = mesh.scale.z * 0.001
			OS.scene.add( mesh );
		} );
		

		// Alternatively, to parse a previously loaded JSON structure
		//var object = loader.parse( a_json_object );

	}
}