var Config = {};
Config.db = {};
Config.app={};
Config.auth = {};

//Config.db.host = 'localhost:27017';
//Config.db.name = 'library';
Config.db.URI ="mongodb://localhost:27017/library2021";
Config.db.options = {
    // tldr the following four lines prevent deprecation warnings
    // they do  not seem to cause any problems in application. 
    // for more details https://mongoosejs.com/docs/5.x/docs/deprecations.html 
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true, 
    useUnifiedTopology: true
  }

// Use environment defined port or 3000
Config.app.port = process.env.PORT || 3000;

Config.auth.jwtSecret = "very secret secret";

module.exports = Config; 