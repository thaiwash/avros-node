var AVROS = require("avros");

var instance = new AVROS()
instance.Serve(9774)
var obj = AVROS.CreateObject("cube")

instance.SpawnObject(obj)
obj.position = instance.player[0].frontPosition()

//instance.MongoDB("url")
//instance.EnableMultiplayer()
