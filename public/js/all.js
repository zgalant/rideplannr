D = console;
cur_user = "";      // the logged in user, so we know who's viewing the page

function showUserInfo(user_name) {
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
}


function msgReceived(msg){
    if (msg.path == window.location.pathname) {
        switch (msg.type) {
            case "join_group":
                $.tmpl(Markup.group_listing_markup, msg).appendTo("#group-list");
                break;
            case "add_event":
                $.tmpl(Markup.evnt_listing_markup, msg).appendTo("#event-list");
                break;
            case "add_car":
                if (msg.success) {
                    $.tmpl(Markup.ride_listing_markup, msg).appendTo("#ride-list");
                } else {
                    Alerts.alert_user("You're already driving a car for this event.", msg.sender);
                }
                
                break;
            case "join_car":
                var alert_text = "";
                if (msg.way_there) {
                    if (msg.success.way_there) {
                        $.tmpl(Markup.rider_in_car_markup, msg).appendTo(".way-there[data-rid='" + msg.ride._id + "']");
                    } else {
                        alert_text = "Sorry, there is no space on the way there.\n";
                    }
                    
                }
                if (msg.way_back) {
                    if (msg.success.way_back) {
                        $.tmpl(Markup.rider_in_car_markup, msg).appendTo(".way-back[data-rid='" + msg.ride._id + "']");
                    } else {
                        alert_text = alert_text + "Sorry, there is no space on the way back.";
                    }
                }
                if (alert_text != "") {
                    Alerts.alert_user(alert_text, msg.sender);
                }
                break;
            case "join_event":
                var new_attendee = $.tmpl(Markup.event_attendee_markup, msg)
                new_attendee.appendTo("#event-users");
                showUserInfo(new_attendee[0]);
                break;
        }
    }
}

$(document).ready(function () {
    socket = new io.Socket();
    socket.connect("http://rideplannr.heroku.com");
    socket.on('message', function(msg){msgReceived(msg)});
    
    var appID = '268047249892587';
    if ($("#development").html() == "true") {
        appID = "222924957782676";
    }
    
    FB.init({ 
        appId:appID,
        cookie:true, 
        status:true,
        xfbml:true,
        oath:true 
    });
    
    if (window.location.pathname != '/') {
        FB.getLoginStatus(function(response) {
            if (response.status != "connected") {
                window.location = "/";
            } else {
                cur_user = response.authResponse.userID;
            }
        });
    }
    
    $(".user-name[data-uid]").each(function() {
        var user_name = this;
        showUserInfo(this);
    });
    
    $("#logout-button").live('click', function() {
        FB.logout(function(response) {
            console.log('logged out');
            window.location = "/";
        });
    });
    
    $(".close-popup").live('click', function() {
        $(".popup").addClass("gone");
        $(".popup input, .popup textarea").val("");
    });
    

});
