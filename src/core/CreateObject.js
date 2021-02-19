/**
 * @author Taivas Gogoljuk

Object description can have
 - "type" = "cube" | "sphere" | "plane" | "empty"
 - "id" = number
 **/

module.exports = {
  /**
     * Spawns object in front of connected players

     * @method
     * @param {String} player - player name
     * @param {Object} params - description object
  */
  "SpawnAsInterest": function(player, object) {
    var t1 = new Transform(this.players[player].head.position, this.players[player].head.rotation);

    var vec = t1.transformPosition(new Vector3(0, 0, 0.5))


    object.position = vec
    object.rotation = this.players[player].head.rotation

    this.DescribeObject(object, player)
  },

  "SpawnAsInterestThree": function(player, object) {
    //var t1 = new Transform(this.players[player].head.position, this.players[player].head.rotation);
    var head = new THREE.Object3D()
    head.quaternion = this.players[player].head.rotation
    head.position = this.players[player].head.position

    var obj = new THREE.Object3D()
    head.add(obj)
    obj.position = new THREE.Vector3(0, 0, 0.5)

    //var vec = t1.transformPosition(new Vector3(0, 0, 0.5))

    var vec = new THREE.Vector3()
    obj.getWorldPosition(vec)
    //var quat = new THREE.Quaternion()
    //obj.getWorldQuaternion(quat)

    object.position = vec
    object.rotation = this.players[player].head.rotation

    this.DescribeObject(object, player)
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
  },


  /**
   * Describe object to unity instance
   * @method
   * @param {Object} Object - Object to update
   * @param {String} PlayerName - Updated player's name. Required if instance sharing is disabled
   */
  "DescribeObject": function(data, player) {
    if (isVoid(player) && !this.instanceSharing) {
      this.systemMessage("Player identity required for unsared instances", "ERROR")
      return
    }


    // convert to API interpretable form
    var objArr = this.Construct(data)

        //console.log(objArr)

    for (var i = 0; i < objArr.length; i++) {
      if (!this.instanceSharing) {
        if (isVoid(this.players[player])) {
          this.systemMessage("Player list disintegrity " + player, "ERROR")
          console.log(this.players)
          return
        }


        var socket = this.GetPlayerSocket(player)
        if (isVoid(socket)) {
          this.systemMessage("Player socket disintegrity " + player, "ERROR")
          return
        }
        this.systemMessage(player + ": Spawn object", "NOTICE")
        this.systemMessage(JSON.stringify(objArr[i]), "NOTICE")
        this.emit("object changed", objArr[i])

        socket.emit("object description", objArr[i])
        this.UpdatePlayerObjectLedger(player, objArr[i])

      } else {
        console.log("sockets emit")
        // multiplayer
        // todo: broadcast to all players within a range
        this.emit("object changed", objArr[i])
        this.io.sockets.emit("object description", objArr[i])
      }
    }


  }


}
