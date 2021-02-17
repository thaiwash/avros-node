/**
Tier translations translate objects between tiers,
Tier0 is raw data, or the type of data that gets communicated through the socket
Its always string format JSON object
Tier1 is Human readable JSON, it's optimized for manual configuration.
Tier2 is Math3d library converted, and can be used for further calculations
 */

 module.exports = {
   "Tier2ToTier0": function(object) {


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
        _obj.type = object.type
      }

      if (isVoid(object.name)) {
        _obj.name = ""
      } else {
        _obj.name = object.name
      }

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

      if (!isVoid(object.rotation)) {
        if (!isVoid(object.rotation.w)) {
          _obj.rotX = object.rotation.x + ""
          _obj.rotY = object.rotation.y + ""
          _obj.rotZ = object.rotation.z + ""
          _obj.rotW = object.rotation.w + ""
        } else {
          var q = Quaternion.Euler(
            parseInt(object.rotation.x),
            parseInt(object.rotation.y),
            parseInt(object.rotation.z)
          )
          _obj.rotX = q.x + ""
          _obj.rotY = q.y + ""
          _obj.rotZ = q.z + ""
          _obj.rotW = q.w + ""
        }
      } else {
        if (isVoid(object.rotX)) {
          _obj.rotX = "0"
        } else {
          _obj.rotX = object.rotX + ""
        }
        if (isVoid(object.rotY)) {
          _obj.rotY = "0"
        } else {
          _obj.rotY = object.rotY + ""
        }
        if (isVoid(object.rotZ)) {
          _obj.rotZ = "0"
        } else {
          _obj.rotZ = object.rotZ + ""
        }
        if (isVoid(object.rotW)) {
          _obj.rotW = "0"
        } else {
          _obj.rotW = object.rotW + ""
        }
      }

      if (!isVoid(object.parent)) {
        _obj.parent = object.parent + ""
      }

      if (!isVoid(object.children)) {
        _obj.children = object.children
      }

      return _obj
    },
    "Tier2ToTier1": function(obj) {
      return this.Tier2ToTier0(this.Tier0ToTier1(obj))
    }
}
