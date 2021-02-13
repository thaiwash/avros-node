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
      return
    }
    ret.id = parseInt(obj.object_id)
    ret.type = obj.type

    if (!isVoid(obj.parent)) {
      ret.parent = parseInt(obj.parent)
    }

    ret.position = {
      "x": parseFloat(obj.posX),
      "y": parseFloat(obj.posY),
      "z": parseFloat(obj.posZ)
    }
    ret.rotation = {
      "x": parseFloat(obj.rotX),
      "y": parseFloat(obj.rotY),
      "z": parseFloat(obj.rotZ),
      "w": parseFloat(obj.rotW)
    }
    ret.scale = {
      "x": parseFloat(obj.scaleX),
      "y": parseFloat(obj.scaleY),
      "z": parseFloat(obj.scaleZ)
    }
    return ret
  },

  "Tier0ToTier2": function(obj) {
    return this.Tier1ToTier2(this.Tier0ToTier1(obj))
  }
}