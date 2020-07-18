'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var expect      = require('chai').expect;
var cors        = require('cors');
const helmet = require("helmet");
var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');
const MongoClient     = require('mongodb').MongoClient;
const mongo           = new MongoClient(process.env.DB, {useNewUrlParser:true, useUnifiedTopology:true});
const robots = require("express-robots-txt");

var app = express();


app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

//robots.txt sitemap
app.use(robots(__dirname + '/robots.txt'));

// sitemap.xml

app.get('/sitemap.xml', function(req, res) {
res.sendFile(process.cwd()+'/sitemap.xml');
});

app.get('/sitemap', function(req, res) {
res.sendFile(process.cwd()+'/sitemap.xml');
});
//

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

mongo.connect((err, db)=>{
  if(err){
    console.log("db connection error")
  } else {
    console.log("connection success")
  
  


//Sample front-end
app.route('/:project/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app, db);

//Routing for API 
apiRoutes(app, db);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type("text")
    .send('Not Found');
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 3500);
  }
});
    } // mongo else
}); // mongo
module.exports = app; //for testing`