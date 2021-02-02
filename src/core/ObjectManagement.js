/**
 * @author Taivas Gogoljuk
 **/
module.exports = {
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
    var objArr = this.RecursiveContruct(data)

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


  },

  /**
   * Bookkeeping
   * @method
   * @param {String} player - Player's name.
   * @param {Object} data - Object to update
   */
  "UpdatePlayerObjectLedger": function(player, data) {

    // Update player spesific object ledger
    var objs = this.players[player].objects
    for (var i = 0; i < objs.length; i++) {
      if (objs[i].object_id == data.object_id) {
        objs[i] = data
        return
      }
    }
    this.players[player].objects.push(data)
  },

  /**
   * Called whenever player changes anything
   * @method
   * @param {Object} data - Object to update
   * @param {String} player - Updated player's name. Required if instance sharing is disabled
   */

  "ObjectUpdateEvent": function(data, player) {
    this.emit("object changed", data)
    if (this.instanceSharing) {
      this.players[player].socket.broadcast.emit("object changed", data)
    }
    this.systemMessage("" + player + " changed object " + data.name + " " + data.object_id, "NOTICE")
  },


  /**
   * Get all objects within the instance
   * @method
   * @return {Array} data - all objects
   */
  "AllObjects": function() {
    var objs = []
    var playerNames = Object.keys(this.players)
    for (var i = 0; i < playerNames.length; i++) {
      if (isVoid(this.players[playerNames[i]].objects)) {
        this.players[playerNames[i]].objects = []
      }
      for (var i2 = 0; i2 < this.players[playerNames[i]].objects.length; i2++) {
        objs.push(this.players[playerNames[i]].objects[i2])
      }
    }
    return objs
  }
}