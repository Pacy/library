var Config = {};
Config.db = {};
Config.app={};
Config.auth = {};

//Config.db.host = 'localhost:27017';
//Config.db.name = 'library';
Config.db.URI ="mongodb://localhost:27017/library2021";
Config.db.options = {
    // tl;dr: the following four lines prevent deprecation warnings
    // they do not seem to cause any problems in application when enabling them. 
    // for more details https://mongoosejs.com/docs/5.x/docs/deprecations.html 
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true, 
    useUnifiedTopology: true
  }

// Use environment defined port or 3000
Config.app.port = process.env.PORT || 3000;

// should be kept sectret
Config.auth.jwtKey = "e16dbaad19dd4de4189fc6a3bccd294cd80c7d38ec3a741d115727fb0391d06ce7e7bc381881de3b62ca6f35ff085cb6edd4bf5a8976d817748afcb003de9546";

// skipping refresh token for now


module.exports = Config; 