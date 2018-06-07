var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


// Require all models
var db = require("./models");

var PORT = 3000;

//set up server
var app = express();

// Serve static content for the app from the "public" directory
app.use(express.static("public"));

// setting up body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set Handlebars up
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");


// Import routes and give the server access to them
require("./routes/html-routes.js")(app);

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";


// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
  });
