require("../src/main.js")
var instance = new AVROS.Serve(8888)

  /**
   * Application name and icon for avros menu
   * @param {String} AppName - Application name
   * @param {Number} AppIcon - Application icon
   
instance.AppInformation("Tester", "res/icon64x64.png")
If no icon is set, default icon is applied.


   */
   
instance.AppInformation("Test 1")


var thing = new AVROS.Thing("My thing")

thing.set({
  "type": "cube",
  "scale": {
    "x": 0.1,
    "y": 0.1,
    "z": 0.1
  }
})


instance.on("user enter", function(ws) {
  console.log("User entered")
  
  console.log(thing)
  console.log(thing.name)
  instance.SpawnAsInterest(ws, thing)
})
