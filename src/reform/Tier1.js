/**
Tier translations translate objects between tiers,
Tier0 is raw data, or the type of data that gets communicated through the socket
Its always string format JSON object
Tier1 is Human readable JSON, it's optimized for manual configuration.
Tier2 is Math3d library converted, and can be used for further calculations
 */

module.exports = {
  "Tier1ToTier0": function(obj) {
    console.log(this.Tier1ToTier2(obj).id)
    console.log(this.Tier2ToTier3(this.Tier1ToTier2(obj)))
    //console.log(this.Tier3ToTier0(this.Tier2ToTier3(this.Tier1ToTier2(obj)))
    return this.Tier3ToTier0(this.Tier2ToTier3(this.Tier1ToTier2(obj)))
  },
  "Tier1ToTier2": function(obj) {

    if (!isVoid(obj.position)) {
      obj.position = new Vector3(
        parseFloat(obj.position.x),
        parseFloat(obj.position.y),
        parseFloat(obj.position.z)
      )
    } else {
      obj.position = new Vector3()
    }

    if (!isVoid(obj.rotation)) {
      if (!isVoid(obj.rotation.w)) {
        obj.rotation = new Quaternion(
          parseFloat(obj.rotation.x),
          parseFloat(obj.rotation.y),
          parseFloat(obj.rotation.z),
          parseFloat(obj.rotation.w)
        )
      } else {
        obj.rotation = Quaternion.Euler(
          parseFloat(obj.rotation.x),
          parseFloat(obj.rotation.y),
          parseFloat(obj.rotation.z)
        )
      }
    } else {
      obj.rotation = new Quaternion()
    }

    if (!isVoid(obj.scale)) {
      obj.scale = new Vector3(
        parseFloat(obj.scale.x),
        parseFloat(obj.scale.y),
        parseFloat(obj.scale.z)
      )
    } else {
      obj.scale = new Vector3(1, 1, 1)
    }

    return obj
  },
  "Tier1ToTier3": function(obj) {
    return this.Tier2ToTier3(this.Tier1ToTier2(obj))
  }
}