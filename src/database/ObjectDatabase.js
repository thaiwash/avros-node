/**
 * @author Taivas Gogoljuk
 **/


module.exports = {
   /**
    * Activates mongo database with credential configurations
    
    Example: {
      "username": "solaris",
      "password": "s5RLSGfRPQ9zYmB",
      "address":"cluster0.ygien.mongodb.net",
      "dbname": "solarfactory"
    }

    
    * @method
    * @param {Object} config - Connection configurations
    */
  "ActivateMongoDB": function(mongodb) {
    this.MongoClient = require('mongodb').MongoClient;
    var uri = "mongodb+srv://"+mongodb.username+":"+mongodb.password
        +"@"+mongodb.url+"/"+mongodb.db+"?retryWrites=true&w=majority";
    this.dbClient = new MongoClient(uri, { useNewUrlParser: true });
  },
  /**
    * Register and update object. Uses mongodb to track object positions, 
    scale, rotation, last update, owner if necessairy.
    
    This can be done without a database, but it is arguable weather or not it should.
    
    * @method
    * @param {String} playerName - is allso the player id
    * @param {Object} object - GameObject and all its attributes
    */
  "RegisterObjectUpdate": function(playerName, obj) {
    if (!isVoid(this.dbClient)) {
        console.log("object to update:")
        console.log(obj)
    } else {
        console.error("no database connection")
    }
  }
}
