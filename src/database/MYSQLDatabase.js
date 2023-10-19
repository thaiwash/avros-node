


module.exports = {
  /**
   * Activates MYSQL database with credential configurations

   Defaults: {
     "host": "127.0.0.1",
     "user":"root",
     "password": "password",
     "database": "avros"
   }
   

   * @method
   * @param {Object} config - Connection configurations
   */
  "ActivateMYSQL": function(config) {
	this.mysqlSync = require('sync-mysql');
	
	if (isVoid(config.host)) {
		config.host = '127.0.0.1'
	}
	if (isVoid(config.user)) {
		config.user = 'root'
	}
	if (isVoid(config.pasword)) {
		config.password = 'password'
	}
	if (isVoid(config.database)) {
		config.database = 'avros'
	}
	this.DatabaseConnection = new this.mysqlSync({
	  host: config.host,
	  user: config.user,
	  password: config.pasword,
	  database: config.database
	});
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