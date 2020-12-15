/**
 * @author Taivas Gogoljuk
 **/


var defaultIcon = 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAACgUlEQVRoge1YzWoUQRD+WnwGhbBL1p8kqFE8mouoR59BPO4jCB58kH0AySP4AoIbcshuVmEx7BLYHPeQICsLwS4Pduanp3q6p6dnItofDDNV3V39fV1VMzBARERERMT/DFHwvD9+jV80EEQdQAJEABEEEQACSGo2QShfaqt5uHrmbAIgc7bIxE/txHcGgf7Pj28+ZeneKAiQGADoAKQNKII51amPm5f36SDm9Ph5as+OkHKgj95kFqTk1U1odmIUeGqkSFtEwN7zHWzvdnF0OMNkeAIA2HvxEFtPNjE6OMHkyxQA8OzVY2w9vYvxcIrJ528qgOjqbIsZKApiTGKG7SIFgDsPNrC6lLh9fyOZ0nvUxeqScGu7m8zv7fb++HY2zVxYAaSVSGFN3iEMgU2+o8NTLC/WmH1d4KrcRgczLC/WmB+fJr7x8DuW52vMR/PEx6FYhu/GJFSD2Rs404RMQwds4MRe7b/NcWZKqLwx8w3MrXXzWRs4U6rCFAZMBj5Mf+hVDCJSF0DQnzPj4J7VHYbnijH3X97LcWbeQhnytg2Mm2lrCgL8D0UHK4DfIDxpeMS3CjCfkGv6DaQDHUpFAT71axNQL6ZVgGywflsRkG7oQbqFpnbIQNnpXQPpqgLK02/boPmmrpmB629qjwz8XU3tmIGwpBHwUBwz0Ez9hjiUlgWEb+qKJRS2flsRUJu0Yyn4xOdgfo02UL+lpEvil8H8GrVu0E5T21CSgfD1WyWmK0oy0PxHySSgChwy4E4aAfqjKszfgQD1WyWTvggowL+p64AroTMidOo0oO9HyQEL3VH4sUUCfSJaEJH6KUYll/+4D3kpRN9nYURERETEv4vffiF3QpKf+VsAAAAASUVORK5CYII='


module.exports = {
  /**
   * Application name and icon for avros menu
   * @param {Number} AppName - Application name
   * @param {Number} AppIcon - Application icon
   */
  "AppInformation": function(AppName, AppIcon) {
    var self = this
    if (isVoid(this.io)) {
      console.log("Serve needs to be called before AppInformation")
      return
    }

    if (isVoid(AppIcon)) {
      AppIcon = defaultIcon
    } else {
      AppIcon = fs.readFileSync(AppIcon, 'base64')
    }

    this.io.on('connection', function(socket) {
      socket.on('app info request', function() {
        console.log("app info request")
        self.io.sockets.emit("app info callback", {
          "name": AppName,
          "icon": AppIcon
        })
      })
    })
  }
}