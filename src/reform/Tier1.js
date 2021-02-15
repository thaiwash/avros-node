/**
Tier translations translate objects between tiers,
Tier0 is raw data, or the type of data that gets communicated through the socket
Its always string format JSON object
Tier1 is Human readable JSON, it's optimized for manual configuration.
Tier2 is Math3d library converted, and can be used for further calculations
 */

module.exports = {
  "Tier1ToTier0": function(obj) {
    return this.Tier1.Tier2(this.Reform.Tier2.Tier0(obj))
  },
  "Tier1ToTier2": function(obj) {

    obj.position = new Vector3(
      obj.position.x,
      obj.position.y,
      obj.position.z
    )

    if (!isVoid(obj.rotation)) {
      if (!isVoid(obj.rotation.w)) {
        obj.rotation = new Quaternion(
          obj.rotation.x,
          obj.rotation.y,
          obj.rotation.z,
          obj.rotation.w
        )
      } else {
        obj.rotation = Quaternion.Euler(
          obj.rotation.x,
          obj.rotation.y,
          obj.rotation.z
        )
      }
    } else {
      obj.rotation = new Quaternion()
    }

    if (!isVoid(obj.scale)) {
      obj.scale = new Vector3(
        obj.scale.x,
        obj.scale.y,
        obj.scale.z
      )
    } else {
      obj.scale = new Vector3()
    }
    return obj
  }
}
