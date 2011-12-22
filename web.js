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
app.get('/cleardb', function(req, res) {
    cleardb();
    
    res.render('login.jade', { locals: {
        title:'Login'
    }});
});
app.get('/', function(req, res) {
    User.find({}, function(err, users) {
        console.log("ALL USERS");
        console.log(users);
    });
    
    res.render('login.jade', { locals: {
        title:'Login'
    }});
});
app.get('/user/:id', function(req, res) {
    var fbid = req.params.id;
    User.findOne({fbid:fbid}, function(err, user) {
        if (user) {
            Group.find({_id:{$in:user.groups}}, function(err, groups) {
                res.render('user.jade', { locals: {
                    title:'RidePlannr',
                    user:user,
                    groups:groups
                }});
            });

        } else {
            res.render('user.jade', { locals: {
                title:'RidePlannr',
                user:{
                    fbid:"#",
                    fbname:"no user exists",
                },
            }});
        }
    });
    
});

/*
 * @param fbid  facebook id of user who is logging in
 */
app.post("/login", function(req, res) {
    var fbuser = req.body.fbuser;
    console.log("/login");
    console.log(fbuser);
    User.findOne(
        {
            fbid:fbuser.id
        }, 
        function(err, user) {
            if (!user) {
                console.log("making new user");
                var user = new User({
                    first_name:fbuser.first_name,
                    last_name:fbuser.last_name,
                    fbid:fbuser.id,
                    username:fbuser.username,
                
                });
                user.save();
                res.write(JSON.stringify({
                    user:user
                }));
                res.end();
            } else {
                console.log("user exists");
                res.write(JSON.stringify({
                    user:user
                }));
                res.end();
            }
        }
    );
});

app.get("/group/:id", function(req, res) {
    var gid = req.params.id;
    Group.findOne({_id:gid}, function(err, group) {
        User.find({groups : group}, function(err, users) {
            Event.find({group : group}, function(err, events) {
                res.render('group.jade', { locals: {
                    title:'RidePlannr',
                    group:group,
                    users:users,
                    events:events,
                }});
            });

        });

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
      console.log(msg);
      switch(msg.type) {
          case "login":
            console.log("login");
            break;
          case "log":
            console.log(msg.message);
            break;
          case "join_group":
            console.log(msg.fbid + " joining group " + msg.group_name);
            var group_name = msg.group_name;
            var fbid = msg.fbid;
            Group.findOne({name:group_name}, function(err, group) {
                if (group) {
                    console.log("group found: " + group._id);
                } else {
                    var new_group = new Group({
                        name:group_name, 
                        description:"default description"
                    });
                    new_group.save();
                    group = new_group;
                }
                
                User.findOne({fbid:fbid}, function(err, user) {
                    if (user) {
                        user.groups.push(group);
                        user.save();
                        console.log(user);
                        
                        buffer.push({
                            path:msg.path,
                            type:"join_group",
                            group:group,
                            user:user,
                        });
                    }
                });
            });
            break;
        case "add_event":
            var event_name = msg.event_name;
            var gid = msg.group;
            Group.findOne({_id : gid}, function(err, group) {
                var nev = new Event({
                    name:event_name,
                    info:"default info",
                    group:group,
                });
                nev.save();
                group.events.push(nev);
                group.save();
                buffer.push({
                    path:msg.path,
                    type:"add_event",
                    event:nev,
                });
            });
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
    console.log("clearing db");
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
    
    Group.find({}, function(err, cars) {
        for (var i=0; i<cars.length; i++) {
            cars[i].remove();
        }
    });
    
    Membership.find({}, function(err, cars) {
        for (var i=0; i<cars.length; i++) {
            cars[i].remove();
        }
    });
}