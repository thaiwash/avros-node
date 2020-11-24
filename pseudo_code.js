var AVROS = require("avros");

var instance = AVROS.Serve(9774);

instance.MongoDB("url")
instance.EnableMultiplayer();

var obj = AVROS.CreateObject({"type": "cube")

instance.SpawnObject()

obj.position = instance.player[0].frontPosition();