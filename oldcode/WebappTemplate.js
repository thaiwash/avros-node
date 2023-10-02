//var avros = require("avros")
var avros = require("./avros.js")
const { createCanvas, loadImage } = require('canvas')

avros.open(9774)



class Commerce {
	constructor() {
					

		var self = this
		
		
			avros.io.on('connection', function(socket) {
				console.log("app info registe2")
				socket.on('app info request', function() {
					console.log("app info request2")
				})
			})
			
			
		avros.on("player entered", function(playerName) {
			console.log(playerName + "connected")
			avros.io.socket[playerName].emit("app info callback", 
				{
					"name" : "Template",
             	}
			)
			/*avros.io.sockets.emit("app info callback", 
				{
					"name" : "Template",
					"icon" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAACdlBMVEVHcEz/gP/Xr//UsP8jaP8fZv/br/8xYf8laP8pZv+qqv+qu/9xxv8zZv8qZv8tZf8kYf8kav8rZv/Wrf/arv/dqv/Ysf/drf/jq//jrP/TsP/gq//grf/drf/arv+Uvv+kuv+PwP+Vv/+Uvv+Zu/+juf+ovf+Svf+kuv+Xvf+hu/+avf+nuf+YvP+dvf+huv/MIv/HJP87X/+AAP/DI/+/IP8zXP+yLP+xLP+uLf+0LP+1K/+8J/+3K/+5Kf+5KP9ux/+1Kf+/J/+7J/+xLf84YP+mu/+ZzP9sxv+quf9xxv+jMv+qL/+wLv+oMf+nMP+/QP+tLf+qMf+lLf+qOf+nMf+jMv+qL/+xt/+qqv+xuv+tuP93xv93xf90xf80Yv84YP89Yf8kbf8fcP8cbP80Yv8xYv8tZf8xZP8fa/8jaP8/Xf87X/8fa/8cbP/DJP/GI/+avf+evP+Xvf+hu/+Ov/+Rv/+Uvv+KwP+kuv+Hwf+Ewv+Bwv+nuv+quf+tuP+3tv+0t/+xt/93xf9ux/9xxv90xf+1Kv+4Kf+nMP+qL/9aUf9XU/9TVP9MV/9QVv9JWf9eUP9GWv+PO/9CXP+SOf+LPP+IPv9hTv+WOP9lTf+EP/9oS/+ZNv96RP99Qv+BQf9sSv9vSP9zR/92Rf+dNf+gM/+jMv+uLf+/Jv+xLP+8J//Xr//Ur//arv84YP80Yv8xY/8jaf8tZf8qZv8maP9+w//grP+6tf/AtP+9tP/Es//Hsv/Nsf/Ksf/QsP/drf97xP94uv9wu/9uvP91u/9Gcf9CcP9Dcv8+cv9yvf9rvf87cv8/dP9uvf9nvf88df83dP96rQsnAAAAa3RSTlMAAvn3FhkjFdMZAw8tGdfSFdfSOIoPDea9vDpkY+mL+fk5i/cPiyMj9+zsvTdvvG8P0NMCwggZTPt+UvztPPZ/6mSsl2zXpAUtterCmTey4AT0KhEJGtPt0Akawy3q6tfSFRUZ19LX19LX0nDKIcsAAALySURBVFjD7dflV9tQGAbwYBuDubu7u7u7u7vBBNfCNraVulCglFKo4Nva4i5zl/9oLyFpbnNv0nzm8Pvw5u3N06f0lHMKFNWvD3ks0e1bAgWPpHoQRi6oqakZERb4B735UChWXx9eHx4auCFUKFZXN3xk3dBBgRuEYrW11MBhtf/+vPS3fT+WhNg9QoPXC7f+en/+eOXv4GC84b737hDs1OOB8fuX59vH1/6uEhrueK5hDW43jKzvX91fPmT5u3IZa7hx3b1nLe8sOhpGd/enz9ESreQVREXBaGhoeB8lFa/AZIKRDkymdAzhU6PzKKMRRhowGtMwhAI6j9LrYaQCvT4VQyig8yitFkYy0GqTMYQCOo/S6WAkAJ0uAUMooPMojQZGItBoEjFsaMY8/zxKrYaRBNTqJAwbmjVt5mw0j1KpYMQBlSoOw4ZgXbAkgsujDAYYMcBgiBG3iMujzGYYscBsjhW3lMujLBYY8cBiicewIVgXLovg8iirFUYKsFpTMGxo/vQ5kWgeZbfD2CuTyex2GYYNLZ7rn0c5HDD2HcjIcDgyMIRfJDqPcjp75oVLmU5nJoZQ0JtHuFz0JfK8y/UCQyhg8hybrfd60WZ7jiEUsHmf4mLf8gxDKPDlWSUl/IVqahL5fuFijMJC/kK1tIgUcDFGfj5/oZqbRQq4GCMvj79Qra0iBVyMkZPDX6i2NpECLsbIzeUvVEeHSAEXYxQU8BeqvV2kgIsxior4C9XZKVLAxRilpf7LxJC3IGSUUIEvzyorO8Uu9GVA8BsQPECogIlxzpYfOk0v5eW9B1PfgdGCb4GN+Zw5pjh6vGdRKHoPxo7r6poyhvhkBY1/evKc8nDPValkDiY1Nk4mv7qShh0fOVGxAS4VFczjoPETgoQ/BV8MsW591W6KqqqS9KcxMbZDvmkjJZcHeKqcQbq3LXvrluzsAAXZDOLNXdWbq6slvQWB2KqdlZWVkgqEYmtWP5FKoHn5iqcS9f+T1pf8B80DJd1iafEWAAAAAElFTkSuQmCC"
				}
			)*/
			
			avros.io.sockets.emit("tts", {"say" : "Wellcome "+playerName})
			self.createAppTemplate(playerName)
			
		})
	}
	
	
	createAppTemplate(playerName) {
		var self = this
		
		this.canvas = createCanvas(1000, 1000)
		this.ctx = this.canvas.getContext('2d')
		
		var obj = {
			"object_id": "12321",
			"scaleX": "0.03",
			"scaleY": "0.003",
			"scaleZ": "0.03",
			"type": "cube",
			"name": "Commerce" 
		}
		
		obj.posX = avros.players[playerName].leftController.position.x + ""
		obj.posY = avros.players[playerName].leftController.position.y + ""
		obj.posZ = avros.players[playerName].leftController.position.z + ""
		
		obj.rotX = avros.players[playerName].leftController.rotation._x + ""
		obj.rotY = avros.players[playerName].leftController.rotation._y + ""
		obj.rotZ = avros.players[playerName].leftController.rotation._z + ""
		obj.rotW = avros.players[playerName].leftController.rotation._w + ""

		var bugfix = {
			"object_id": "5584",
			"scaleX": "1",
			"scaleY": "1",
			"scaleZ": "1",
			"type": "empty",
			"name": "nwmBugFix",
			"parent": obj.id
		}
		var plane = {
			"object_id": "3392767",
			"scaleX": "0.1",
			"scaleY": "0.0", 
			"scaleZ": "0.1",
			"rotY": "1.0",
			"rotX": "0.0",
			"posY": "0.6",
			"type": "plane",
			"name": "fsmPlane",
			"parent": bugfix.id
		}
		
		if (isVoid(avros.getPlayerSocket(playerName))) {
			return
		}
		avros.getPlayerSocket(playerName).emit("object changed", obj)
		avros.getPlayerSocket(playerName).emit("object changed", bugfix)
		avros.getPlayerSocket(playerName).emit("object changed", plane)
		//avros.getPlayerSocket(playerName).emit("object changed", rcplane)

        avros.getPlayerSocket(playerName).emit("set texture", {
            "object_id": plane.id,
            "texture": this.getTexture(this.canvas)
        })
        avros.getPlayerSocket(playerName).emit("add tag", {
			"object_id": obj.id,
			"tag": "Grab"
		})
		
		avros.getPlayerSocket(playerName).on("button down", function(data) {
			console.log(data)
		})
		
	}
	// Legacy Shaders/Transparent/Cutout/Soft Edge Unlit
	getTexture(canvas) {
		return canvas.toDataURL().substr("data:image/png;base64,".length);
	}
}

var com = new Commerce()


function isVoid(variable) {
	if (typeof variable === "undefined") {
        return true
	}
    return false
}
