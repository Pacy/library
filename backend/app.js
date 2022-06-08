
const express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  // bodyParser = require('body-parser'),
  dataBaseConfig = require('./config/config.js'),
  createError = require('http-errors');


// Connecting mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(dataBaseConfig.db.URI, dataBaseConfig.db.options).then(() => {
  console.log('Database connected sucessfully ')
},
  error => {
    console.log('Could not connected to database : ' + error)
  }
);

const app = express();

// Parsers for POST data
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: false
// }));
//body-parser re-added in express >=4.16
app.use(express.json())
app.use(express.urlencoded({extended: true}))
// Option to enable COR only to certain domains
// var corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
// }

// app.use(cors(corsOptions))
app.use(cors()); //ajax policy overcome, not sure if needed right now

//passport TODO
/*
var passport = require('passport');
var jwtConfig = require('./passport/jwtConfig');
app.use(passport.initialize());
jwtConfig(passport);
*/

// Setting up static directory
app.use(express.static(path.join(__dirname, 'dist/library')));


/*
/ Routing
*/
// Set up express js port
const mediaRoute = require('./media/mediaRoute.js');
// RESTful API root
app.use('/api/media', mediaRoute);
//app.get('/', (req, res) => res.send('Hello World!'));

// unsupported get error
app.get('*', (req, res) => {
  console.log("404")
  res.status(404).send('invaild endpoint #get');
});

// Find 404 and hand over to error handler
app.use((req, res, next) => {
  //var myJSON = JSON.stringify(req);
  //console.log(myJSON);
  console.log(res + "- " + "\n" + this.toString());
  next(createError(404, "not found"));
});



// error handler
app.use(function (err, req, res, next) {
  console.error("Error: ", err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

module.exports = app;
