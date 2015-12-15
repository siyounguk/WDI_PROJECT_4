  var cookieParser   = require("cookie-parser");
var cors           = require('cors');
var express    = require("express");
var expressJWT = require("express-jwt");
var morgan     = require("morgan");
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var passport   = require("passport");
var path           = require('path');
var app        = express();
var config     = require('./config/config');
var port       = process.env.PORT || 3000;
// Connect to DB
mongoose.connect(config.database);
// mongoose.set('debug', true);
// Setup Passport
require('./config/passport')(passport);

// Secret JWT phrase, should move to process.env
var secret     = config.secret;

// JWT access control. Important to have these before our routes!
app
  .use('/api', expressJWT({secret: config.secret})
  .unless({path: ['/api/login', '/api/register'], method: 'post'}));

// Handle "No authorization token was found" errors
app.use(function (error, request, response, next) {
  if (error.name === 'UnauthorizedError') {
    response.status(401).json({message: 'You need an authorization token to view confidential information.'});
  }
});

// Setup Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());

// Setup CORS
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

app.use(passport.initialize());

// Require routes
var routes = require('./config/routes');
app.use('/api', routes);

// Start Server
app.listen(port, function () {
  console.log( "Express server listening on port " + port);
});