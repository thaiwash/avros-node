module.exports = {


  "ActivateInstanceIntegrityIntelligence": function() {
    var self = this
    this.requiredTasks = []
    this.rationalizationInterval = setInterval(function() {
      self.RationalizeObjects()
    }, 3000)
  },

  /*

  This pure Artificial Intelligence, A function that upkeeps instance integrity,
  so that humans that connect certainly share the same instance.

  */

  "RationalizeObjects": function() {

    var objs = this.AllObjects()
    var playerNames = Object.keys(this.players)
    for (var i = 0; i < playerNames.length; i++) {
      for (var i2 = 0; i2 < this.players[playerNames[i]].objects.length; i2++) {
        var obj = this.players[playerNames[i]].objects[i2]

        // check if object belongs to a disconnected player
        if (!isVoid(this.players[playerNames[i]].objects[i2].owner)) {
          if (isVoid(this.GetPlayerSocket(obj.owner))) {
            this.systemMessage("server: player " + playerNames[i] + " is disconnected. " + obj.name + " will be deleted")
            //this.getPlayerSocket(playerNames[i]).emit("object destroyed", obj)

            this.requiredTasks.push({
              "target": playerNames[i],
              "action": "object destroyed",
              "object": obj
            })

            this.players[playerNames[i]].objects.splice(i2, 1)
            i2 = 0
          }
        }


        if (!isVoid(obj.type)) {
          for (var i3 = 0; i3 < playerNames.length; i3++) {


            // check for object existance
            var found = false

            for (var i4 = 0; i4 < this.players[playerNames[i3]].objects.length; i4++) {
              var obj2 = this.players[playerNames[i3]].objects[i4]
              if (obj.name == obj2.name) {
                var found = true
              }

              // check for OOS
              if (obj.object_id == obj2.object_id) {
                if (!this.IsSimilar(obj, obj2)) {

                  if (obj.syncTime > obj2.syncTime) {
                    this.systemMessage("player " + playerNames[i3] + " object " + obj2.name + " is out of sync")
                    //this.getPlayerSocket(playerNames[i3]).emit("object changed", obj)
                    this.requiredTasks.push({
                      "target": playerNames[i3],
                      "action": "object changed",
                      "object": obj2
                    })
                  } else {
                    this.systemMessage("player " + playerNames[i] + " object " + obj.name + " is out of sync")
                    //this.getPlayerSocket(playerNames[i]).emit("object changed", obj2)
                    this.requiredTasks.push({
                      "target": playerNames[i],
                      "action": "object changed",
                      "object": obj2
                    })
                  }
                }
              }
            }
            if (!found) {
              this.systemMessage("player " + playerNames[i3] + " is missing object " + obj.name)
              if (isVoid(this.GetPlayerSocket(playerNames[i3]))) {
                this.systemMessage("warning: player " + playerNames[i3] + " is missing a socket")
              }
              this.systemMessage(obj)
              //this.getPlayerSocket(playerNames[i3]).emit("object changed", obj)
              this.requiredTasks.push({
                "target": playerNames[i3],
                "action": "object changed",
                "object": obj
              })
            }

          }
        }
      }
    }
  },

  "IsSimilar": function(obj1, obj2) {

    if (isVoid(obj1)) {
      return false
    }
    if (isVoid(obj2)) {
      return false
    }
    var keys = Object.keys(obj1)
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] == "object_id") {
        continue
      }
      if (keys[i] == "syncTime") {
        continue
      }
      if (isVoid(obj2[keys[i]])) {
        return false
      }
      if (obj1[keys[i]] != obj2[keys[i]]) {
        return false
      }
    }
    return true
  }
}
