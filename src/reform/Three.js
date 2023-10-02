/*
  var q = new THREE.Quaternion()
  q.setFromEuler(new THREE.Euler(
    parseInt(object.rotation.x),
    parseInt(object.rotation.y),
    parseInt(object.rotation.z)
  ))'BoxGeometry'
  */

module.exports = {
  "Tier3ToTier0": function(object) {

    var _obj = {}
    if (!isVoid(object.id)) {
      _obj.object_id = parseInt(object.id) + ""
    } else {
      _obj.object_id = this.GenerateId() + ""
    }


    if (!isVoid(object.object_id)) {
      _obj.object_id = parseInt(object.object_id) + ""
    }

    if (isVoid(_obj.object_id)) {
      _obj.object_id = this.GenerateId() + ""
    }

    if (_obj.object_id.length == 0) {
      console.warn("Refacturing ID complications")
      _obj.object_id = this.GenerateId() + ""
    }


    if (isVoid(object.type)) {
      _obj.type = "empty"
    } else {

      if (object.type == 'BoxGeometry') {
        _obj.type = "cube"
      }
      if (object.type == 'SphereGeometry') {
        _obj.type = "sphere"
      }
      if (object.type == 'PlaneGeometry') {
        _obj.type = "plane"
      }
    }

    if (isVoid(object.name)) {
      _obj.name = ""
    } else {
      _obj.name = object.name
    }

    /*
    if (!isVoid(object.scale)) {
      _obj.scaleX = object.scale.x + ""
      _obj.scaleY = object.scale.y + ""
      _obj.scaleZ = object.scale.z + ""
    } else {
      if (isVoid(object.scaleX)) {
        _obj.scaleX = "1"
      } else {
        _obj.scaleX = object.scaleX
      }
      if (isVoid(object.scaleY)) {
        _obj.scaleY = "1"
      } else {
        _obj.scaleY = object.scaleY
      }
      if (isVoid(object.scaleZ)) {
        _obj.scaleZ = "1"
      } else {
        _obj.scaleZ = object.scaleZ
      }
    }*/

    if (!isVoid(object.parameters)) {
      _obj.scaleX = object.parameters.width + ""
      _obj.scaleY = object.parameters.height + ""
      _obj.scaleZ = object.parameters.depth + ""
    }
    

    if (!isVoid(object.position)) {
      _obj.posX = object.position.x + ""
      _obj.posY = object.position.y + ""
      _obj.posZ = object.position.z + ""
    } else {
      if (isVoid(object.posX)) {
        _obj.posX = "0"
      } else {
        _obj.posX = object.posX + ""
      }
      if (isVoid(object.posY)) {
        _obj.posY = "0"
      } else {
        _obj.posY = object.posY + ""
      }
      if (isVoid(object.posZ)) {
        _obj.posZ = "0"
      } else {
        _obj.posZ = object.posZ + ""
      }
    }


    object.rotation.z *= -1; // flip Z

    object.rotation.y -= (Math.PI); // Y is 180 degrees off

    var quat = new THREE.Quaternion();
    quat.setFromEuler(object.rotation);


    _obj.rotX = (-quat._x) + ""
    _obj.rotY = quat._y + ""
    _obj.rotZ = quat._z + ""
    _obj.rotW = (-quat._w) + ""

    if (!isVoid(object.parent)) {
      _obj.parent = object.parent + ""
    }

    if (!isVoid(object.children)) {
      _obj.children = object.children
    }

    return _obj
  },
  "Tier3ToTier1": function(object) {},
  "Tier3ToTier2": function(object) {

  }
}