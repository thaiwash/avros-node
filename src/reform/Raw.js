/**
Tier translations translate objects between tiers,
Tier0 is raw data, or the type of data that gets communicated through the socket
Its always string format JSON object
Tier1 is Human readable JSON, it's optimized for manual configuration.
Tier2 is Math3d library converted, and can be used for further calculations
 */

// todo: tier0->tier1->tier2-tier0
module.exports = {
  "Tier0ToTier1": function(obj) {
    var ret = {}
    if (isVoid(obj)) {
      console.log("Not a valid tier0 object")
      console.log(obj)
      return ret
    }
    ret.id = parseInt(obj.object_id)
    ret.type = obj.type

    if (!isVoid(obj.parent)) {
      ret.parent = parseInt(obj.parent)
    }

    if (!isVoid(obj.posX)) {
      ret.position = {
        "x": parseFloat(obj.posX),
        "y": parseFloat(obj.posY),
        "z": parseFloat(obj.posZ)
      }
    } else {
      ret.position = {
        "x": 0,
        "y": 0,
        "z": 0
      }
    }

    if (!isVoid(obj.rotX)) {
      ret.rotation = {
        "x": parseFloat(obj.rotX),
        "y": parseFloat(obj.rotY),
        "z": parseFloat(obj.rotZ)
      }
      if (!isVoid(obj.rotW)) {
        ret.rotation.w = parseFloat(obj.rotW)
      }
    } else {
      ret.rotation = {
        "x": 0,
        "y": 0,
        "z": 0
      }
    }

    if (!isVoid(obj.scaleX)) {
      ret.scale = {
        "x": parseFloat(obj.scaleX),
        "y": parseFloat(obj.scaleY),
        "z": parseFloat(obj.scaleZ)
      }
    } else {
      ret.scale = {
        "x": 1,
        "y": 1,
        "z": 1
      }
    }
    return ret
  },

  "Tier0ToTier2": function(obj) {
    return this.Tier1ToTier2(this.Tier0ToTier1(obj))
  },

  "Tier0ToTier3": function(obj) {
    return this.Tier2ToTier3(this.Tier1ToTier2(this.Tier0ToTier1(obj)))
  }
}