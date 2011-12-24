$(document).ready(function () {
    var eid = $("#eid").html();
    
    $(".user-name[data-uid]").each(function() {
        var user_name = this;
        var uid = $(user_name).attr("data-uid");
        D.log(uid);
        $.ajax({
            type:"GET",
            url:"/ajax/get_user",
            data:{
                uid:uid,
            },
            dataType: 'JSON',
            success: function(response) {
                response = JSON.parse(response);
                var user = response.user;
                $(user_name).html(user.first_name + " " + user.last_name);
                $(".user-image[data-uid='" + uid + "']").attr("src", "http://graph.facebook.com/" + user.fbid + "/picture?type=square");
            }
        });
    });
    
    FB.getLoginStatus(function(response) {
        D.log(response);
        if (response.status == "connected") {
            var fbid = response.authResponse.userID;
            D.log(fbid);
            $("#add-ride-button").live('click', function() {
                var there = $("#way-there").val();
                var back = $("#way-back").val();
                var leaving = $("#leaving").val();
                var returning = $("#returning").val();
                var notes = $("#ride-notes").val();
                if (parseInt(there) <= 0 || parseInt(back) <= 0) {
                    Alerts.alert_user("Invalid number of seats in the car.", fbid);
                    return;
                }
                $("#new-popup input, #new-popup textarea").val("");
                $(".popup").addClass("gone");
                socket.send({
                    type:"add_car",
                    fbid:fbid,
                    eid:eid,
                    seats:{
                        there:there,
                        back:back,
                    },
                    notes:notes,
                    leaving:leaving,
                    returning:returning,
                    path:window.location.pathname,
                    sender:fbid,
                });
            });
            
            $("#show-add-ride").live('click', function() {
                $("#new-popup").removeClass("gone");
                $("#new-popup input[type='number']").val("4");
            });
            
            $(".join-ride-there").live('click', function() {
                var rid = $(this).attr("data-rid");
                socket.send({
                    type:"join_car",
                    fbid:fbid,
                    rid:rid,
                    way_there:true,
                    way_back:false,
                    path:window.location.pathname,
                    sender:fbid,
                });
            });
            $(".join-ride-back").live('click', function() {
                var rid = $(this).attr("data-rid");
                socket.send({
                    type:"join_car",
                    fbid:fbid,
                    rid:rid,
                    way_there:false,
                    way_back:true,
                    path:window.location.pathname,
                    sender:fbid,
                });
            });
            $(".join-ride-both").live('click', function() {
                var rid = $(this).attr("data-rid");
                socket.send({
                    type:"join_car",
                    fbid:fbid,
                    rid:rid,
                    way_there:true,
                    way_back:true,
                    path:window.location.pathname,
                    sender:fbid,
                });
            });
        }
    });

});