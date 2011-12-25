D = console;
cur_user = "";      // the logged in user, so we know who's viewing the page

var group_listing_markup = "<a href='/group/${group._id}' class='group'><div>${group.name}</div></a>";
var evnt_listing_markup = "<a href='/event/${event._id}' class='event'><div>${event.name}</div></a>";
var ride_listing_markup = 
                        "<div data-rid='${ride._id}' class='ride-listing'>\
                            <div class='driver'>\
                                <img class='user-image driver-image'\
                                    src='http://graph.facebook.com/${driver.fbid}/picture?type=square' />\
                                <div class='driver-info'>\
                                    <div class='user-name driver-name'>${driver.first_name} ${driver.last_name}</div>\
                                    <div class='clear'></div>\
                                    <div class='ride-notes'>${ride.notes}</div>\
                                </div>\
                                <div class='join-ride-buttons'>\
                                    <div class='hopin'>Hop in:</div>\
                                    <button class='join-ride-there' type='submit' data-rid='${ride._id}'>Way There</button>\
                                    <button class='join-ride-back' type='submit' data-rid='${ride._id}'>Way Back</button>\
                                    <button class='join-ride-both' type='submit' data-rid='${ride._id}'>Both</button>\
                                </div>\
                            </div>\
                            <div class='clear'></div>\
                            <div class='riders-list way-there' data-rid='${ride._id}'>\
                                <div class='rider'>Way There (${seats.there} spots) Leaving: ${leaving}</div>\
                            </div>\
                            <div class='riders-list way-back' data-rid='${ride._id}'>\
                                <div class='rider'>Way Back (${seats.back} spots) Returning: ${returning}</div>\
                            </div>\
                        </div>";
                        
var rider_in_car_markup = "<div class='rider'>\
                        <img class='user-image rider-image'\
                            src='http://graph.facebook.com/${rider.fbid}/picture?type=square' />\
                        <div class='user-name rider-name'>${rider.first_name} ${rider.last_name}</div>\
                    </div><div class='clear'></div>";



function msgReceived(msg){
    if (msg.path == window.location.pathname) {
        switch (msg.type) {
            case "join_group":
                $.tmpl(group_listing_markup, msg).appendTo("#group-list");
                break;
            case "add_event":
                $.tmpl(evnt_listing_markup, msg).appendTo("#event-list");
                break;
            case "add_car":
                if (msg.success) {
                    $.tmpl(ride_listing_markup, msg).appendTo("#ride-list");
                } else {
                    Alerts.alert_user("You're already driving a car for this event.", msg.sender);
                }
                
                break;
            case "join_car":
                var alert_text = "";
                if (msg.way_there) {
                    if (msg.success.way_there) {
                        $.tmpl(rider_in_car_markup, msg).appendTo(".way-there[data-rid='" + msg.ride._id + "']");
                    } else {
                        alert_text = "Sorry, there is no space on the way there.\n";
                    }
                    
                }
                if (msg.way_back) {
                    if (msg.success.way_back) {
                        $.tmpl(rider_in_car_markup, msg).appendTo(".way-back[data-rid='" + msg.ride._id + "']");
                    } else {
                        alert_text = alert_text + "Sorry, there is no space on the way back.";
                    }
                }
                if (alert_text != "") {
                    Alerts.alert_user(alert_text, msg.sender);
                }
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
