var express = require('express');
var app = express.createServer(express.logger());
// var dbinfo = require('./dbinfo.js')

// Mongoose
var Goose = {};

Goose.mongoose = require('mongoose');
Goose.Schema = Goose.mongoose.Schema;
Goose.ObjectId = Goose.Schema.ObjectId;


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
    Goose.mongoose.connect('mongodb://localhost/rideplannrdb');
    console.log("dev");
});

app.configure('production', function() {
    app.use(express.errorHandler());
    Goose.mongoose.connect("mongodb://heroku:passwrd12@staff.mongohq.com:10066/app1082689");
    console.log("production");
});
// END Configuration


// URLS
app.get('/cleardb', function(req, res) {
    cleardb();
    
    res.render('login.jade', { locals: {
        title:'Login',
        development:(app.settings.env == "development"),
    }});
});
app.get('/', function(req, res) {
    User.find({}, function(err, users) {
        console.log("ALL USERS");
        console.log(users);
    });
    
    // console.log(app);
    console.log(app.settings.env);
    
    res.render('login.jade', { locals: {
        title:'Login',
        development:(app.settings.env == "development"),
        
    }});
});
app.get('/user/:id', function(req, res) {
    var fbid = req.params.id;
    User.findOne({fbid:fbid}, function(err, user) {
        if (user) {
            console.log(user);
            Group.find({_id:{$in:user.groups}}, function(err, groups) {
                res.render('user.jade', { locals: {
                    title:'RidePlannr - ' + user.first_name + " " + user.last_name,
                    development:(app.settings.env == "development"),
                    user:user,
                    groups:groups
                }});
            });

        } else {
            User.findOne({_id:fbid}, function(err, user) {
                if (user) {
                    Group.find({_id:{$in:user.groups}}, function(err, groups) {
                        res.render('user.jade', { locals: {
                            title:'RidePlannr - ' + user.first_name + " " + user.last_name,
                            development:(app.settings.env == "development"),
                            user:user,
                            groups:groups
                        }});
                    });
                } else {
                    User.findOne({username:fbid}, function(err, user) {
                        if (user) {
                            Group.find({_id:{$in:user.groups}}, function(err, groups) {
                                res.render('user.jade', { locals: {
                                    title:'RidePlannr - ' + user.first_name + " " + user.last_name,
                                    development:(app.settings.env == "development"),
                                    user:user,
                                    groups:groups
                                }});
                            });
                        } else {
                            res.render('user.jade', { locals: {
                                title:'RidePlannr',
                                development:(app.settings.env == "development"),
                                user:{
                                    fbid:"#",
                                    fbname:"no user exists",
                                },
                            }});
                        }
                    });
                }
            });
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
                    email:fbuser.email,
                
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
                    title:'RidePlannr - ' + group.name,
                    development:(app.settings.env == "development"),
                    group:group,
                    users:users,
                    events:events,
                }});
            });

        });

    });
});

app.get("/event/:id", function(req, res) {
    var eid = req.params.id;
    Event.findOne({_id:eid}, function(err, ev) {
        Group.findOne({_id : ev.group}, function(err, group) {
            Ride.find({_id : {$in: ev.rides}}, function(err, rides) {
                console.log(rides);
                res.render('event.jade', { locals: {
                    title:'RidePlannr - ' + ev.name,
                    development:(app.settings.env == "development"),
                    event:ev,
                    group:group,
                    rides:rides,
                }});
            });
        });
    });
});

app.get("/ajax/get_user", function(req, res) {
    var uid = req.query.uid;
    User.findOne({_id:uid}, function(err, user) {
        res.write(JSON.stringify({
            user:user
        }));
        res.end();
        return;
    });
});

app.get("/ajax/group_search", function(req, res) {
    var q = req.query.q;
    var regex = ".*" + q + ".*";
    Group.find({name : {"$regex": regex}}, function(err, groups) {
        res.write(JSON.stringify({
            groups:groups
        }));
        res.end();
        return;
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

require('./actions.js').Actions();

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
            Action.join_group(msg, Goose, buffer);
            break;
        case "add_event":
            Action.add_event(msg, Goose, buffer);
            break;
        case "add_car":
            Action.add_car(msg, Goose, buffer);
            break;
        case "join_car":
            Action.join_car(msg, Goose, buffer);
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
}