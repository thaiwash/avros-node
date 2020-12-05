/**
 * @author Taivas Gogoljuk
 **/
module.exports = {
  /**
   * Update object
   * @method
   * @param {Object} Socket - updater's socket instance
   * @param {Object} Object - Object to update
   */
  "UpdateObject": function(socket, data) {
    if (isVoid(socket.playerName)) {
      console.error("Unidentified user")
      return
    }
    if (isVoid(this.players[socket.playerName])) {
      this.systemMessage("server: warning; syncing before inited")
      return
    }
    if (data.name.search("Controller") == -1 && data.name.search("Camera") == -1) {
      this.systemMessage("server " + socket.playerName + " registered object " + data.name + " " + data.object_id)
    }
    this.emit("object changed", data)


    data.syncTime = (new Date()).getTime()
    this.RegisterObjectUpdate(socket.playerName, data)

    // multiplayer
    socket.broadcast.emit("object changed", data)

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
