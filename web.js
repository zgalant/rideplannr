var express = require('express');
var app = express.createServer(express.logger());

// Mongoose
var Goose = {};

Goose.mongoose = require('mongoose');
Goose.Schema = Goose.mongoose.Schema;
Goose.ObjectId = Goose.Schema.ObjectId;

Goose.mongoose.connect('mongodb://localhost/rideplannrdb');

Goose.mongooseTypes = require("mongoose-types");
Goose.useTimestamps = Goose.mongooseTypes.useTimestamps;
Goose.mongooseTypes.loadTypes(Goose.mongoose);

Goose.Email = Goose.mongoose.SchemaTypes.Email;
Goose.Url = Goose.mongoose.SchemaTypes.Url;

require('./models/schema.js').SetUp(Goose);
// END Mongoose

// Configuration
app.configure(function() {
    app.set('views', __dirname + "/views");
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname+'/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler({dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});
// END Configuration


// URLS
app.get('/', function(req, res) {
    // cleardb();
    res.render('login.jade', { locals: {
        title:'Login'
    }});
});
app.get('/user/:id', function(req, res) {
    res.render('index.jade', { locals: {
        title:'RidePlannr'
    }});
});

app.post("/login", function(req, res) {
    var fbuser = req.body.fbuser;
    console.log(fbuser);
    User.findOne({fbid:fbuser.id}, function(err, user) {
        console.log(err);
        console.log(user);
        if (!user) {
            console.log("making new user");
            var user = new User({
                first_name:fbuser.first_name,
                last_name:fbuser.last_name,
                fbid:fbuser.id,
                username:fbuser.username,
                
            });
            user.save();
        } else {
            console.log("user exists");
            res.write(JSON.stringify({
                user:user
            }));
            res.end();
        }
    });
});

// END URLS



var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});


// Socket.IO Stuff
var socket = require('socket.io').listen(app);
var buffer = new Array();
function sendNewItems(){
    if(next = buffer.pop()){ 
        socket.broadcast(next); 
    }
}

socket.on('connection', function(client){ 
  client.on('message', function(msg){
      switch(msg.type) {
          case "login":
            console.log("login");
            break;
          case "log":
            console.log(msg.message);
            break;
      };

  });

  
});

setTimeout(function(){
    sendNewItems();
    setTimeout(arguments.callee, 1);
},
1);





function cleardb() {
    Car.find({}, function(err, cars) {
        for (var i=0; i<cars.length; i++) {
            cars[i].remove();
        }
    });
    
    User.find({}, function(err, cars) {
        for (var i=0; i<cars.length; i++) {
            cars[i].remove();
        }
    });
    
    Ride.find({}, function(err, cars) {
        for (var i=0; i<cars.length; i++) {
            cars[i].remove();
        }
    });
    
    Rider.find({}, function(err, cars) {
        for (var i=0; i<cars.length; i++) {
            cars[i].remove();
        }
    });
    
    Event.find({}, function(err, cars) {
        for (var i=0; i<cars.length; i++) {
            cars[i].remove();
        }
    });
}