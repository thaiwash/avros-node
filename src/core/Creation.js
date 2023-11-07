/**
 * @author Taivas Gogoljuk

Object description can have
 - "type" = "cube" | "sphere" | "plane" | "empty"
 - "id" = number
 **/

module.exports = {


  /**
     * Spawns object in front of connected players
     (to be depricated)

     * @method
     * @param {WebSocket} ws - Web socket
     * @param {Thing} obj - object as a Thing
  */
  "SpawnAsInterest": function(ws, object) {
	if(isVoid(object)) {
		console.log("Invalid object given to SpawnAsInterest")
		return
	}
    var t1 = new Transform(this.users[ws.connectionID].head.position, this.users[ws.connectionID].head.rotation);


    var vec = t1.transformPosition(new Vector3(0, 0, 0.5))


    object.position = vec
    object.rotation = this.users[ws.connectionID].head.rotation

	console.log(object.name)
    this.DescribeObject(ws, object)
  },

  "SpawnAsInterestThree": function(ws, object) {
    //var t1 = new Transform(this.players[player].head.position, this.players[player].head.rotation);
    var head = new THREE.Object3D()
    head.quaternion = this.users[ws.connectionID].head.rotation
    head.position = this.users[ws.connectionID].head.position

    var obj = new THREE.Object3D()
    head.add(obj)
    obj.position = new THREE.Vector3(0, 0, 0.5)

    //var vec = t1.transformPosition(new Vector3(0, 0, 0.5))

    var vec = new THREE.Vector3()
    obj.getWorldPosition(vec)
    //var quat = new THREE.Quaternion()
    //obj.getWorldQuaternion(quat)

    object.position = vec
    object.rotation = this.users[ws.connectionID].head.rotation

    this.DescribeObject(ws, object)
  },

  /**
     * Spawns in object

     * @object
     * @param {Object} params - description object
  */
  "Spawn": function(object) {
    this.UpdateObject(this.Construct(object))
  },

  /**
   * Spawns a prefabricated asset made with unity
   * @method
   * @param {String} asset - path to asset
   * @returns {Object} Returns the generated object
   */
  "SpawnAsset": function(type) {
    return {
      "object_id": generateId(),
      "type": type
    }
  },


  /**
   * Constructs an object so that it can be sent to the uninty server
   
   This is a complex function I made to make parenting recursives

   * @method
   * @param {Object} Object - Object to update
   * @return {Array} ArrayObject - An object array with constructed objects
   */
  "Construct": function(obj) {
    this._constructuonRecursion(obj)
    var ret = global.collection
    global.collection = undefined
    for (let i = 0; i < ret.length; i++) {
      if (ret[i].children) {
        delete ret[i].children
      }
    }
    ret = this.clean(ret)
    return ret.reverse()
  },

  "clean": function(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj
  },

  "_constructuonRecursion": function(obj) {
    obj = this.Tier1ToTier0(obj)
    if (!isVoid(obj.children)) {
      for (let i = 0; i < obj.children.length; i++) {
        obj.children[i].parent = obj.object_id
        this._constructuonRecursion(obj.children[i])
      }
    }

    if (isVoid(global.collection)) {
      global.collection = []
    }
    global.collection.push(obj)
  }



}
