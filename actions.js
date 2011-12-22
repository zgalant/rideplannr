module.exports.Actions = Actions;
function Actions() {
    Action = {};
    Action.join_group = function(msg, Goose, buffer) {
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
    }
    Action.add_event = function(msg, Goose, buffer) {
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
    }
    Action.add_car = function(msg, Goose, buffer) {
        var eid = msg.eid;
        var fbid = msg.fbid;
        
        User.findOne({fbid: fbid}, function(err, user) {
            Event.findOne({_id : eid}, function(err, ev) {
                var ride = new Ride({
                    driver:user,
                });
                ride.save();
                ev.rides.push(ride);
                ev.save();
                buffer.push({
                    path:msg.path,
                    type:"add_car",
                    ride:ride,
                    driver:user,
                });
            });
        });
    }
    
    Action.join_car = function(msg, Goose, buffer) {
        var rid = msg.rid;
        var fbid = msg.fbid;

        User.findOne({fbid: fbid}, function(err, user) {
            Ride.findOne({_id : rid}, function(err, ride) {
                ride.riders.push(user);
                ride.save();
                buffer.push({
                    path:msg.path,
                    type:"join_car",
                    ride:ride,
                    rider:user,
                });
            });
        });
    }
}

