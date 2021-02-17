var AVROS = require("../src/main.js")
var instance = new AVROS()



var fileCube = {
  "id": instance.GenerateId(),
  "type": "cube",
  "parent": 25,
  "scale": {
    "x": 0.8,
    "y": 0.8,
    "z": 0.1
  },
  "position": {
    "x": 1,
    "y": 1,
    "z": -1
  },
  "children": [
    {
      "id": instance.GenerateId(),
      "type": "plane",
      "scale": {
        "x": 0.1,
        "y": 0.1,
        "z": 0.1
      },
      "rotation": {
        "x": "90",
        "y": "180",
        "z": "0"
      },
      "position": {
        "x": 0.0,
        "y": 0.0,
        "z": -0.51
      }
    }
  ]
}

console.log(instance.Tier1ToTier0(fileCube))

  var item = instance.Construct(fileCube)
  console.log(item[0])
  var conversion = item[0]
  conversion = instance.Tier0ToTier1(conversion)
  console.log(conversion)
  conversion = instance.Tier1ToTier2(conversion)
  console.log(conversion)
  process.exit(0)
