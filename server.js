var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var Sequelize = require('sequelize')

var PORT = process.env.PORT || 8080;

var app = express();

// Authintication Packages
var session = require('express-session');
const passport = require("passport");
var MySQLStore = require('express-mysql-session')(session);


var db = require("./models");

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

var options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "project2_db",
};

// var connect = require('connect')
//     // for express, just call it with 'require('connect-session-sequelize')(session.Store)'
//     , SequelizeStore = require('connect-session-sequelize')(connect.session.Store);
 
// connect().use(connect.session({
//     store: new SequelizeStore(options)
//     , secret: 'CHANGEME'
// }));

var SequelizeStore = require('connect-session-sequelize')(session.Store);

var sequelize = new Sequelize(
  "project2_db",
  "root",
  "password", {
      "dialect": "mysql",
      "storage": "./session.mysql"
  });

app.use(session({
  secret: 'asjodifjasdfjlk',
  resave: false, 
  // store: sessionStore,
  store: new SequelizeStore({
    db: sequelize
  }),
  saveUninitialized: false,
  // cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
// var routes = require("./controllers/loginController.js");
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);
// app.use(routes);

// Start our server so that it can begin listening to client requests.
db.sequelize.sync({}).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});