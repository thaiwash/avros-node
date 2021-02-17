/*
  var q = new THREE.Quaternion()
  q.setFromEuler(new THREE.Euler(
    parseInt(object.rotation.x),
    parseInt(object.rotation.y),
    parseInt(object.rotation.z)
  ))
  */

module.exports = {
  "Tier3ToTier0": function(object) {
  "Tier3ToTier1": function(object) {
  "Tier3ToTier2": function(object) {
    if (!isVoid(obj.position)) {
      obj.position = new THREE.Vector3(
        obj.position.x,
        obj.position.y,
        obj.position.z
      )
    } else {
        obj.position = new THREE.Vector3()
    }

    if (!isVoid(obj.rotation)) {
      if (!isVoid(obj.rotation.w)) {
        obj.rotation = new THREE.Quaternion(
          obj.rotation.x,
          obj.rotation.y,
          obj.rotation.z,
          obj.rotation.w
        )
      } else {
        var q = new THREE.Quaternion()
        obj.rotation = q.setFromEuler(new THREE.Euler(
          obj.rotation.x,
          obj.rotation.y,
          obj.rotation.z
        ))
      }
    } else {
      obj.rotation = new THREE.Quaternion()
    }

    if (!isVoid(obj.scale)) {
      obj.scale = new THREE.Vector3(
        obj.scale.x,
        obj.scale.y,
        obj.scale.z
      )
    } else {
      obj.scale = new THREE.Vector3()
    }

    return obj
  }
