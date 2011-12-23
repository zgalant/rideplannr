module.exports.Actions = Actions;
function Actions() {
    Action = {};
    Action.join_group = function(msg, Goose, buffer) {
        console.log(msg.fbid + " joining group " + msg.group_name);
        var group_name = msg.group_name;
        var group_info = msg.group_info;
        var fbid = msg.fbid;
        Group.findOne({name:group_name}, function(err, group) {
            if (group) {
                console.log("group found: " + group._id);
            } else {
                var new_group = new Group({
                    name:group_name, 
                    description:group_info,
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
        var event_info = msg.event_info;
        var gid = msg.group;
        Group.findOne({_id : gid}, function(err, group) {
            var nev = new Event({
                name:event_name,
                info:event_info,
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
        var seats_there = msg.seats_there;
        var seats_back = msg.seats_back;
        console.log(seats_there);
        var leaving = msg.leaving;
        var returning = msg.returning;
        var notes = msg.notes;
        
        User.findOne({fbid: fbid}, function(err, user) {
            Event.findOne({_id : eid}, function(err, ev) {
                var ride = new Ride({
                    driver:user,
                    seats_there:seats_there,
                    seats_back:seats_back,
                    leaving:leaving,
                    returning:returning,
                    notes:notes,
                });
                ride.save();
                ev.rides.push(ride);
                ev.save();
                buffer.push({
                    path:msg.path,
                    type:"add_car",
                    ride:ride,
                    driver:user,
                    seats_there:seats_there,
                    seats_back:seats_back,
                    leaving:leaving,
                    returning:returning,
                    notes:notes,
                });
            });
        });
    }
    
    Action.join_car = function(msg, Goose, buffer) {
        var rid = msg.rid;
        var fbid = msg.fbid;
        var way_there = msg.way_there;
        var way_back = msg.way_back;

        User.findOne({fbid: fbid}, function(err, user) {
            Ride.findOne({_id : rid}, function(err, ride) {
                if (way_there) {
                    ride.way_there.push(user);
                }
                if (way_back) {
                    ride.way_back.push(user);
                }
                ride.save();
                buffer.push({
                    path:msg.path,
                    type:"join_car",
                    ride:ride,
                    rider:user,
                    way_there:way_there,
                    way_back:way_back,
                });
            });
        });
    }
}

