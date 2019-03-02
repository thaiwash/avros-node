class FileSystem {
	save(filename) {
		if (!controller.isGrabbing(LEFT)) {
			return "Saveable object needs to be grabbed with the left hand"
		}
		if (typeof filename === "undefined") {
			filename = "sphere.json"
		}
		
		socket.emit("save project", {"file": "public/save/"+filename, "data":spheres.sphereToJson(controller.getGrabbedObject(LEFT))})
    	console.log("save objects")
		return "Saved as " + filename
	}
	
	load(filename) {
		if (typeof filename === "undefined") {
			filename = "sphere.json"
		}

		socket.emit("load project", {"file": "public/save/"+filename})
		
		socket.on("load project callback", function(data) {
			console.log("server callback")
			spheres.jsonToSphere(data.saveData)
		})
		return "" + filename + " loaded"
	}
}