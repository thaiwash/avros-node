/**
 * @author Taivas Gogoljuk
 **/


var defaultIcon = 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAACgUlEQVRoge1YzWoUQRD+WnwGhbBL1p8kqFE8mouoR59BPO4jCB58kH0AySP4AoIbcshuVmEx7BLYHPeQICsLwS4Pduanp3q6p6dnItofDDNV3V39fV1VMzBARERERMT/DFHwvD9+jV80EEQdQAJEABEEEQACSGo2QShfaqt5uHrmbAIgc7bIxE/txHcGgf7Pj28+ZeneKAiQGADoAKQNKII51amPm5f36SDm9Ph5as+OkHKgj95kFqTk1U1odmIUeGqkSFtEwN7zHWzvdnF0OMNkeAIA2HvxEFtPNjE6OMHkyxQA8OzVY2w9vYvxcIrJ528qgOjqbIsZKApiTGKG7SIFgDsPNrC6lLh9fyOZ0nvUxeqScGu7m8zv7fb++HY2zVxYAaSVSGFN3iEMgU2+o8NTLC/WmH1d4KrcRgczLC/WmB+fJr7x8DuW52vMR/PEx6FYhu/GJFSD2Rs404RMQwds4MRe7b/NcWZKqLwx8w3MrXXzWRs4U6rCFAZMBj5Mf+hVDCJSF0DQnzPj4J7VHYbnijH3X97LcWbeQhnytg2Mm2lrCgL8D0UHK4DfIDxpeMS3CjCfkGv6DaQDHUpFAT71axNQL6ZVgGywflsRkG7oQbqFpnbIQNnpXQPpqgLK02/boPmmrpmB629qjwz8XU3tmIGwpBHwUBwz0Ez9hjiUlgWEb+qKJRS2flsRUJu0Yyn4xOdgfo02UL+lpEvil8H8GrVu0E5T21CSgfD1WyWmK0oy0PxHySSgChwy4E4aAfqjKszfgQD1WyWTvggowL+p64AroTMidOo0oO9HyQEL3VH4sUUCfSJaEJH6KUYll/+4D3kpRN9nYURERETEv4vffiF3QpKf+VsAAAAASUVORK5CYII='

var devTool = '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'

module.exports = {
  /**
   * Application name and icon for avros menu
   * @param {String} AppName - Application name
   * @param {Number} AppIcon - Application icon
   */
  "AppInformation": function(AppName, AppIcon) {
    var self = this

    if (isVoid(AppIcon)) {
      AppIcon = defaultIcon
    } else if (AppIcon == "DevTool") {
      AppIcon = devTool
    } else {
	  if (fs.existsSync(AppIcon)) {
		AppIcon = fs.readFileSync(AppIcon, 'base64')
		  //console.log("App icon is "+AppIcon)
	  } else {
		  console.log("App icon not found")
		  AppIcon = defaultIcon
	  }
	  
    }

    this.wss.on('connection', function(ws) {
			
	  ws.on('message', function(message) {
		  if (message == "app info request") {
			  console.log("Got app info request")
			  ws.send("app info callback|"+JSON.stringify({
				  "name": AppName,
				  "icon": AppIcon
				})
			  )
		  }
	  });
  
    })
  }
}