
class Thing {
  constructor(name) {
    this.name = name
	this.id = this.makeId()
	this.object_id = this.id
	this.position = { x: 0, y: 0, z: 0 }
	this.scale = { x: 1, y: 1, z: 1 }
	this.rotation = { x: 0, y: 0, z: 0, w: 1 }
  }

  makeId() {
    if (isVoid(global.idCount)) {
      global.idCount = 0
    }
    global.idCount += 1
    return global.idCount
  }

  set(obj) {
    for (let [key, value] of Object.entries(obj)) {
      //console.log(`${key}: ${value}`);
	  if (key == "id") {
		  this.id = value
		  this.object_id = value
	  } else if (key == "eulerRotation") {
		  this.rotation = Quaternion.Euler(parseFloat(value.x), parseFloat(value.y), parseFloat(value.z))
	  } else {
		  this[key] = value
	  }
    }
	if (obj.database) {
	  if (value) {
		  if (!isVoid(this.DatabaseConnection)) {
			  
		  }
	  }
	}
  }
  
  getJSON() {
    var _obj = {}


    if (!isVoid(this.object_id)) {
      _obj.object_id = parseInt(this.object_id) 
    } else if (!isVoid(this.id)) {
      _obj.object_id = parseInt(this.id)
    } else {
      _obj.object_id = this.makeId()
    }
	
	
    if (isVoid(this.type)) {
      _obj.type = "empty"
    } else {
      if (this.type == 'BoxGeometry') {
        _obj.type = "cube"
      } else
      if (this.type == 'SphereGeometry') {
        _obj.type = "sphere"
      } else
      if (this.type == 'PlaneGeometry') {
        _obj.type = "plane"
      } else {
        _obj.type = this.type
      }

    }
	
    if (isVoid(this.name)) {
      _obj.name = ""
    } else {
      _obj.name = this.name
    }
	
    if (!isVoid(this.position)) {
		_obj.position = {
			"x": this.position.x,
			"y": this.position.y,
			"z": this.position.z
		}
	}
    if (!isVoid(this.rotation)) {
		_obj.rotation = {
			"x": this.rotation.x,
			"y": this.rotation.y,
			"z": this.rotation.z,
			"w": this.rotation.w
		}
	}
    if (!isVoid(this.scale)) {
		_obj.scale = this.scale
	}
    if (!isVoid(this.parent)) {
		_obj.parent = this.parent
	}
	
	return JSON.stringify(_obj)
  }
  
  getTransform() {
	  var json = JSON.parse(this.getJSON())
	  json.time = 1000;
	  //json.start_time = Date.now().getTime()
	  json.start_time = 0;
	  return json;
  }
  
  getSocket() {
    var _obj = {}


    if (!isVoid(this.object_id)) {
      _obj.object_id = parseInt(this.object_id) + ""
    } else if (!isVoid(this.id)) {
      _obj.object_id = parseInt(this.id) + ""
    } else {
      _obj.object_id = this.makeId() +""
    }

    if (isVoid(this.type)) {
      _obj.type = "empty"
    } else {
      if (this.type == 'BoxGeometry') {
        _obj.type = "cube"
      } else
      if (this.type == 'SphereGeometry') {
        _obj.type = "sphere"
      } else
      if (this.type == 'PlaneGeometry') {
        _obj.type = "plane"
      } else {
        _obj.type = this.type
      }

    }

    if (isVoid(this.name)) {
      _obj.name = ""
    } else {
      _obj.name = this.name
    }

    if (!isVoid(this.scale)) {
      _obj.scaleX = this.scale.x + ""
      _obj.scaleY = this.scale.y + ""
      _obj.scaleZ = this.scale.z + ""
    } else {
      if (isVoid(this.scaleX)) {
        _obj.scaleX = "0"
      } else {
        _obj.scaleX = this.scaleX + ""
      }
      if (isVoid(this.scaleY)) {
        _obj.scaleY = "0"
      } else {
        _obj.scaleY = this.scaleY + ""
      }
      if (isVoid(this.scaleZ)) {
        _obj.scaleZ = "0"
      } else {
        _obj.scaleZ = this.scaleZ + ""
      }
    }


    if (!isVoid(this.position)) {
      _obj.posX = this.position.x + ""
      _obj.posY = this.position.y + ""
      _obj.posZ = this.position.z + ""
      _obj.posZ = this.position.w + ""
    } else {
      if (isVoid(this.posX)) {
        _obj.posX = "0"
      } else {
        _obj.posX = this.posX + ""
      }
      if (isVoid(this.posY)) {
        _obj.posY = "0"
      } else {
        _obj.posY = this.posY + ""
      }
      if (isVoid(this.posZ)) {
        _obj.posZ = "0"
      } else {
        _obj.posZ = this.posZ + ""
      }
    }

    if (!isVoid(this.quaternion)) {
      _obj.rotX = this.quaternion.x + ""
      _obj.rotY = this.quaternion.y + ""
      _obj.rotZ = this.quaternion.z + ""
      _obj.rotW = this.quaternion.w + ""
    } else {
      if (isVoid(this.rotX)) {
        _obj.rotX = "0"
      } else {
        _obj.rotX = this.rotX + ""
      }
      if (isVoid(this.rotY)) {
        _obj.rotY = "0"
      } else {
        _obj.rotY = this.rotY + ""
      }
      if (isVoid(this.rotZ)) {
        _obj.rotZ = "0"
      } else {
        _obj.rotZ = this.rotZ + ""
      }
      if (isVoid(this.rotW)) {
        _obj.rotW = "1"
      } else {
        _obj.rotW = this.rotW + ""
      }
    }

    return _obj
  }

  //Waiting to be scrapped or finished
  getUnity() {

  }

  //Waiting to be scrapped or finished
  getTHREE() {
    function ConvertRotation(qx, qy, qz, qw) {

      var q = new THREE.Quaternion(-qx, qy, qz, -qw)
      var v = new THREE.Euler()
      v.setFromQuaternion(q)

      v.y += (Math.PI) // Y is 180 degrees off


      v.z *= -1 // flip Z

      return v
    }
  }
}

global.AVROS.Thing = Thing
