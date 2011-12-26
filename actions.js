module.exports.Actions = Actions;
function Actions() {
    Action = {};
    Action.join_group = function(msg, Goose, buffer) {
        console.log(msg.fbid + " joining group " + msg.group_name);
        var group_name = msg.group_name;
        var group_info = msg.group_info;
        var fbid = msg.fbid;
        var query_params = {name:group_name};
        if (msg.group_id) {
            query_params = {_id:msg.group_id};
        }
        Group.findOne(query_params, function(err, group) {
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
                    
                    group.users.push(user.fbid);
                    group.save();

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
        var seats = msg.seats;
        var leaving = msg.leaving;
        var returning = msg.returning;
        var notes = msg.notes;
        
        Event.findOne({_id : eid}, function(err, ev) {
            User.findOne({fbid: fbid}, function(err, user) {
                Ride.findOne({ride_event:ev, driver:user}, function(err, existing_ride) {
                    if (existing_ride) {
                        buffer.push({
                            path:msg.path,
                            type:"add_car",
                            success:false,
                            sender:fbid,
                        });
                        return;
                    }
                    var ride = new Ride({
                        ride_event:ev,
                        driver:user,
                        seats:seats,
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
                        seats:seats,
                        leaving:leaving,
                        returning:returning,
                        notes:notes,
                        success:true,
                    });
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
                var way_there_success = false;
                var way_back_success = false;
                if (way_there) {
                    if (ride.riders.there.length < ride.seats.there) {
                        ride.riders.there.push(user);
                        way_there_success = true;
                    }
                }
                if (way_back) {
                    if (ride.riders.back.length < ride.seats.back) {
                        ride.riders.back.push(user);
                        way_back_success = true;
                    }
                }
                ride.save();
                buffer.push({
                    path:msg.path,
                    type:"join_car",
                    ride:ride,
                    rider:user,
                    way_there:way_there,
                    way_back:way_back,
                    success:{
                        way_there:way_there_success,
                        way_back:way_back_success,
                    },
                    sender:msg.sender,
                });
            });
        });
    }
}

