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




    //data.syncTime = (new Date()).getTime()
    //this.RegisterObjectUpdate(player, data)


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
      this.systemMessage(JSON.stringify(data), "NOTICE")
      this.emit("object changed", data)
      socket.emit("object description", data)
    } else {
      // multiplayer
      // todo: broadcast to all players within a range
      this.emit("object changed", data)
      this.io.broadcast.emit("object description", data)
    }

    /*
    // Update player spesific object ledger
    var objs = this.players[socket.playerName].objects
    for (var i = 0; i < objs.length; i++) {
      if (objs[i].object_id == data.object_id) {
        objs[i] = data
        return
      }
    }
    this.players[socket.playerName].objects.push(data)
    */
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
  }
}
