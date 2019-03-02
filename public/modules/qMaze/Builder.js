class Builder extends OSModule {
	constructor(config) {
		super()
		
		this.requires = ["modelLoader", "lazer"]
	}
	
	
	init() {
		var self = this
		
		
		this.tools = []
		this.selected = null
		self.noClear = false
		setTimeout(function() {
			self.afterInit()
		}, 100)
		
		self.selectSound = new Audio('modules/qMaze/sound/Select.mp3');
		self.mouseOverSound = new Audio('modules/qMaze/sound/MouseOver.wav');
		
        window.addEventListener("raycaststart", function (evt) {
            //self.add(controller.sphere[0].position, evt.key)
			//console.log(evt)
			var color = 0x04ff00
			if (typeof evt.detail.object.raycastColor !== "undefined") {
				color = evt.detail.object.raycastColor
			}
			
			if (typeof evt.detail.object.material === "undefined") {
				console.warn("raycastable has no material")
				console.warn(evt.detail.object)
				return;
			}
			
			if (typeof evt.detail.object.material.color === "undefined") {
				evt.detail.object.material.color = color
			}
			
			self.lastColor = (new THREE.Color()).copy(evt.detail.object.material.color)
			evt.detail.object.material.color.set( color );
			self.selected = evt.detail.object
			
			if (self.lastSelected != null) {
				if (self.lastSelected.id == self.selected.id) {
					return
				}
			}
			
			if (self.selected != null) {
				self.lastSelected = self.selected
			}
			
			//console.log(evt.detail)
			
			var sub = []
			for (var i = 0; i < self.buttonPanel.children.length; i++) {
				if (typeof self.buttonPanel.children[i].isSubmenu !== "undefined") {
					sub.push(self.buttonPanel.children[i])
				}
			}
			if (sub.length > 0) {
				if (typeof evt.detail.object.isSubmenu === "undefined") {
					self.hideSubmenus(self)
				}
				self.mouseOverSound.play()
				self.animateSubmenu(sub)
			}
			
        });
		
		self.lastRaycastTime = 0
        window.addEventListener("raycast", function (evt) {
			
			//console.log(self.lastRaycastTime - (new Date()).getTime())
			
			if(typeof evt.object != null) {
				self.lastRaycastTime = (new Date()).getTime()
				clearTimeout(self.t)
				self.t = setTimeout(function() {
					console.log("hid now")
					self.hideSubmenus(self)
				}, 1000)
			}
        });
		
        window.addEventListener("raycastend", function (evt) {
            //self.add(controller.sphere[0].position, evt.key)
			//evt.detail.object.material.color.set( 0xff00ff );
			console.assert(typeof self.lastColor !== "undefined")
			//console.log(evt.detail)
			self.selected.material.color = new THREE.Color( self.lastColor.r, self.lastColor.g, self.lastColor.b );
        });
		
        window.addEventListener("entervr", function (evt) {
			//self.addTool("builder.house")
			//self.addTool("builder.house.position.x+=0.05")
			//self.addTool("builder.house.position.y += 0.05")
			//self.addTool("builder.house.position.z += 0.05")
		})
	}
	
	
	hideSubmenus(_self) {
		for (var i = 0; i < _self.buttonPanel.children.length; i++) {
			if (typeof _self.buttonPanel.children[i].isSubmenu !== "undefined") {
				_self.buttonPanel.children[i].scale.x = 0
				_self.buttonPanel.children[i].position.x = 0.07
				_self.buttonPanel.children[i].visible = false
			}
		}
		clearInterval(self.anim)
	}
	
	animateSubmenu(_buttons) {
		var self = this
		self.multiplyer = 0.1
		self.count = 0
		clearInterval(self.anim)
		this.anim = setInterval(function() {
			self.multiplyer += 0.1
			// while slace is not full
			if (_buttons[0].scale.x < 1) {
				// loop menu keys
				var keys = Object.keys(self.Menu)
				for (var i = 0; i < keys.length; i++) {
					if (keys[i] == self.selected.text) {
						// loop sub keys
						var subKeys = Object.keys(self.Menu[keys[i]])
						for (var i2 = 0; i2 < subKeys.length; i2 ++) {
							var subMenu = subKeys[i2]
							
							
				for (var i3 = 0; i3 < _buttons.length; i3++) {
					_buttons[i3].scale.x += 0.3 * self.multiplyer
					_buttons[i3].position.x += (0.0014 * 30) * self.multiplyer
					self.count += _buttons[i3].scale.x * ((0.0014 * 30) * self.multiplyer)
					if (typeof _buttons[i3].isSubmenu !== "undefined") {
						if (_buttons[i3].text == subMenu) {
							_buttons[i3].visible = true
						}
					}
				}
				
						}
					}
				}
				
				OS.scene.updateMatrixWorld()
			} else {
				clearInterval(self.anim)
			}
		}, 50)
	}
	
	addTool(code) {
		var tool = textLoader.load(code, OS.defaultLocation)
		this.tools.push(tool)
		//this.fit(tool)
		//this.scale(tool, 0.3)
	}
	
	afterInit() {
		
		
		this.Menu = {
			"Design cabin": {
				"Base": {},
				"Wall log thickness & style": {},
				"Height adjusments": {},
				"Roof overhang adjusments": {},
			},
			"Doors & Windows": {
				"Comfort serie": {},
				"Height highest doors": {}
			},
			"Add walls": {
				"Walls": {},
				"Doors": {}
			},
			"Log cabin color": {
				"Cabin protection products": {}
			},
			"Options": {
				"Choose your roof covering": {},
				"Floors & foundation": {}
			},
			"Customer": {}
		}
		
		
		var material = new THREE.MeshBasicMaterial( {color: 0x005d2f, transparent: true, opacity: 0} );
		var geometry = new THREE.BoxGeometry( 0.7, 0.6, 0.01 );
		var buttonPanel = new THREE.Mesh( geometry, material );
		this.buttonPanel = buttonPanel
		controller.grabbableObjects.push(buttonPanel)
		geometry.computeFaceNormals();
		buttonPanel.position.copy(OS.defaultLocation())
		buttonPanel.position.z -= 0.1
		buttonPanel.position.x -= 0.1
		//buttonPanel.position.y -= 0.5
		buttonPanel.quaternion.copy(headText.spawningQuaternion())
		buttonPanel.ignoreRaycast=true
		var keys = Object.keys(this.Menu)
		for (var i = 0; i < keys.length; i++) {
			var btn = this.spawnButton(keys[i], new THREE.Vector3())
			THREE.SceneUtils.attach(btn, OS.scene, buttonPanel)
			OS.scene.updateMatrixWorld()
			btn.position.y -= 0.05 * i
			btn.position.z += 0.1
			this.spawnSubmenu(btn, this.Menu[keys[i]])
		}
		OS.scene.add( buttonPanel );
		
		
		this.loadGrass()
		this.loadSkybox()
		//this.wall()
		this.loadHouse()
		//modelLoader.loadFBX("modules/qMaze/model/Rulers_A.FBX")
	}
	
	scale(_obj, _scale) {
		_obj.scale.set(
			_obj.scale.x * _scale, 
			_obj.scale.y * _scale, 
			_obj.scale.z * _scale
		)
	}
	
	loadHouse() {
		var self = this
		modelLoader.loadJSONObject("modules/qMaze/model/house.object.json", function(obj) {
			
			self.fit(obj)
			
			//obj.position.z -= 100
			
			self.house = obj;
			
		})
	}
	
	loadGrass() {
		var self = this
		modelLoader.loadJSONObject("modules/qMaze/model/grass.object.json", function(obj) {
			obj.position.copy(OS.defaultLocation())
			obj.quaternion.copy(OS.defaultQuaternion())
			
			
			self.scale(obj, 0.1)
			
			OS.scene.add(obj)
			OS.scene.updateMatrixWorld()
			THREE.SceneUtils.attach(obj, OS.scene, self.buttonPanel)
			obj.position.y -= 1
			obj.rotation.x -= 1.25;
			obj.ignoreRaycast = true
			
			console.log("grass loaded")
			self.grass = obj
			//self.addTool("builder.grass.rotation.x += 0.01")
			//self.addTool("builder.grass.rotation.x -= 0.01")
		})
		//modelLoader.loadJSONObject("modules/qMaze/model/sky.object.json")
	}
	
	fit(_obj) {
		_obj.position.copy(OS.defaultLocation())
		_obj.quaternion.copy(OS.defaultQuaternion())
		
		OS.scene.add(_obj)
		OS.scene.updateMatrixWorld()
		THREE.SceneUtils.attach(_obj, OS.scene, this.buttonPanel)
		_obj.rotation.x += 0.325
		_obj.position.y -= 1
	}
	
	loadSkybox() {
		var urlPrefix = "modules/qMaze/img/skybox/";
        var material = [
			new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture(urlPrefix + "posx.png"), side: THREE.BackSide }),
			new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture(urlPrefix + "negx.png"), side: THREE.BackSide }),      
			new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture(urlPrefix + "posy.png"), side: THREE.BackSide }),
			new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture(urlPrefix + "negy.png"), side: THREE.BackSide }),
			new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture(urlPrefix + "posz.png"), side: THREE.BackSide }),
			new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture(urlPrefix + "negz.png"), side: THREE.BackSide })
        ];
		
		/*
		var urlPrefix = "modules/qMaze/img/skybox/";
		var urls = [ urlPrefix + "posx.png", urlPrefix + "negx.png",
			urlPrefix + "posy.png", urlPrefix + "negy.png",
			urlPrefix + "posz.png", urlPrefix + "negz.png" ];
			*/
		var boxGeometry = new THREE.BoxGeometry(1,1,1)
		
		/**/
          
		this.skyBox = new THREE.Mesh(boxGeometry, material);
		this.skyBox.doubleSided = true;
		this.skyBox.ignoreRaycast = true
		
		this.fit(this.skyBox)
		this.scale(this.skyBox, 200)
		this.skyBox.position.y -= 0.7
		
	}
	
	wall() {
		var self = this
		modelLoader.loadJSONObject("modules/qMaze/model/wall.object.json", function(obj) {
			obj.position.copy(OS.defaultLocation())
			obj.quaternion.copy(OS.defaultQuaternion())
			
			
			self.fit(obj)
			//self.scale(obj, 0.1)
			
			obj.ignoreRaycast = true
			console.log("wall loaded")
			obj.rotation.x += 0.025
			obj.position.y -= 1
			/*self.wallObj = obj;
		setInterval(function() {
			console.log(self.skyBox.rotation.x)
			self.wallObj.rotation.x += 0.05
		}, 2000)*/
		})
	}
		
	
	spawnSubmenu(btn, menuItems) {
		var keys = Object.keys(menuItems)
		for (var i = 0; i < keys.length; i ++) {
			var subMenuButton = this.spawnButton(
				keys[i], 
				OS.defaultLocation(),
				new THREE.Vector3(0.12*2, 0.02*2, 0.01),
				0xffffff
			)
			
			
			THREE.SceneUtils.attach(subMenuButton, OS.scene, this.buttonPanel)
			OS.scene.updateMatrixWorld()
			subMenuButton.position.y -= 0.05 * i
			subMenuButton.position.x += 0.06
			subMenuButton.raycastColor = 0xfbff93
			subMenuButton.scale.x = 0
			subMenuButton.isSubmenu = true
			subMenuButton.text = keys[i]
			
			subMenuButton.visible = false
		}
	}
	
	spawnButton(_text, _position, _scale, _color) {
		if (typeof _color === "undefined") {
			_color = 0x42c92a
		}
		
		if (typeof _scale === "undefined") {
			_scale = new THREE.Vector3(0.09*2, 0.02*2, 0.01)
		}
		
		var geometry = new THREE.BoxGeometry( _scale.x, _scale.y, _scale.z );
		geometry.computeFaceNormals();
		var material = new THREE.MeshBasicMaterial( {color: _color} );
		var cube = new THREE.Mesh( geometry, material );
		//cube.name="button1"
		cube.position.copy(_position)
		cube.quaternion.copy(headText.spawningQuaternion())
		
		cube.raycastable = true
		
		var text = this.spawnText(_text, _position, headText.spawningQuaternion(), 0.8)
		THREE.SceneUtils.attach(text, OS.scene, cube)
		text.position.x -= 0.07 - ((0.18 - _scale.x)/2)
		text.position.z += 0.002
		text.position.y -= 0.005
		cube.text = _text
		
		return cube
	}
	
	spawnMenu() {
		
	}
	
	
    spawnText(text, position, quaterion, textSize = 1) {
		var geometry = new THREE.TextGeometry( text, {
			font: OS.font,
			size: (80/5000) * textSize,
            height: (20/5000) * textSize,
			curveSegments: 2
		});


		var materials = [
			new THREE.MeshBasicMaterial( {
                color: 0x000000, overdraw: 0.5
            } )
		];

		var textGeometry = new THREE.Mesh( geometry, materials );

		if (typeof quaterion === "undefined") {
			//OS.scene.updateMatrixWorld()
		} else {
			textGeometry.quaternion.copy(quaterion)
		}
		
		textGeometry.position.copy(position)
		OS.scene.add( textGeometry )

		return textGeometry
	}
}