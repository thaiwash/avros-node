/**
 * @author Taivas Gogoljuk
 **/
module.exports = {
  /**
   * Update object
   * @method
   * @param {Object} Object - Object to update
   * @param {String} PlayerName - Updated player's name. Required if instance sharing is disabled
   */
  "UpdateObject": function(data, player) {
    if (isVoid(player) && !this.instanceSharing) {
      this.systemMessage("Player identity required for unsared instances", "ERROR")
      return
    }


    if (data.name.search("Controller") == -1 && data.name.search("Camera") == -1) {
      this.systemMessage("server " + player + " registered object " + data.name + " " + data.object_id)
    }


    //data.syncTime = (new Date()).getTime()
    //this.RegisterObjectUpdate(player, data)


    if (!this.instanceSharing) {
      if (isVoid(this.players[player].socket)) {
        this.systemMessage("Player socket disintegrity " + player, "ERROR")
        return
      }
      data.owner = player
      this.emit("object changed", data)
      this.players[player].socket.emit("object changed", data)
    } else {
      // multiplayer
      // todo: broadcast to all players within a range
      this.emit("object changed", data)
      this.io.broadcast.emit("object changed", data)
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
  }
}
