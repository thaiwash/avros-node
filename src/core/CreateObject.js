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

  "_construct": function(object) {
    var _obj = {}
    if (!isVoid(object.id)) {
      _obj.object_id = parseInt(object.id) + ""
    } else {
      _obj.object_id = generateId()
    }


    if (!isVoid(object.object_id)) {
      _obj.object_id = parseInt(object.object_id) + ""
    }

    if (isVoid(_obj.object_id)) {
      _obj.object_id = generateId()
    }

    if (_obj.object_id.length == 0) {
      console.warn("Refacturing ID complications")
      _obj.object_id = generateId()
    }


    if (isVoid(object.type)) {
      _obj.type = "empty"
    } else {
      _obj.type = object.type
    }

    if (isVoid(object.name)) {
      _obj.name = ""
    } else {
      _obj.type = object.name
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
      if (!isVoid(object.rotation.w)){
        _obj.rotX = object.rotation.x + ""
        _obj.rotY = object.rotation.y + ""
        _obj.rotZ = object.rotation.z + ""
        _obj.rotW = object.rotation.w + ""
      } else {
        var q = Quaternion.Euler(parseInt(object.rotation.x), parseInt(object.rotation.y), parseInt(object.rotation.z))
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

    return _obj
  },

  /**
   * Constructs an object so that it can be sent to the uninty server

   * @method
   * @param {Object} Object - Object to update
   * @return {Array} ArrayObject - An object array with constructed objects
   */
  "Construct": function(object) {
    let _obj = this._construct(object)
    let objects = [_obj]
    if (!isVoid(object.children)) {
      for (let i = 0; i < object.children.length; i++) {
        object.children[i].parent = _obj.object_id
        let child = this.Construct(object.children[i])
        objects.push(child[0])
      }
    }

    return objects
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

    console.log(objArr)

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
        // multiplayer
        // todo: broadcast to all players within a range
        this.emit("object changed", objArr[i])
        this.io.broadcast.emit("object description", objArr[i])
      }
    }


  }
}



function generateId() {
  var min = 1;
  var max = 100000;
  return Math.floor(Math.random() * (+max - +min)) + +min;
}
