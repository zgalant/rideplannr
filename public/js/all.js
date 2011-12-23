D = console;

var group_listing_markup = "<a href='/group/${group._id}' class='group'><div>${group.name}</div></a>";
var evnt_listing_markup = "<a href='/event/${event._id}' class='event'><div>${event.name}</div></a>";
var ride_listing_markup = 
                        "<div data-rid='${ride._id}' class='ride-listing'>\
                            <div class='driver'>\
                                <img class='user-image driver-image'\
                                    src='http://graph.facebook.com/${driver.fbid}/picture?type=square' />\
                                <div class='user-name driver-name'>${driver.first_name} ${driver.last_name}</div>\
                                <div class='join-ride-buttons'>\
                                    <div class='hopin'>Hop in:</div>\
                                    <button class='join-ride-there' type='submit' data-rid='${ride._id}'>Way There</button>\
                                    <button class='join-ride-back' type='submit' data-rid='${ride._id}'>Way Back</button>\
                                    <button class='join-ride-both' type='submit' data-rid='${ride._id}'>Both</button>\
                                </div>\
                            </div>\
                            <div class='clear'></div>\
                            <div class='riders-list way-there' data-rid='${ride._id}'>\
                                <div class='rider'>Way There (${seats_there} spots)</div>\
                                <div class='rider'>Leaving: ${leaving}</div>\
                            </div>\
                            <div class='riders-list way-back' data-rid='${ride._id}'>\
                                <div class='rider'>Way Back (${seats_back} spots)</div>\
                                <div class='rider'>Returning: ${returning}</div>\
                            </div>\
                        </div>";
                        
var rider_in_car = "<div class='rider'>\
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
                $.tmpl(ride_listing_markup, msg).appendTo("#ride-list");
                break;
            case "join_car":
                if (msg.way_there) {
                    $.tmpl(rider_in_car, msg).appendTo(".way-there[data-rid='" + msg.ride._id + "']");
                }
                if (msg.way_back) {
                    $.tmpl(rider_in_car, msg).appendTo(".way-back[data-rid='" + msg.ride._id + "']");
                }
                break;
        }
    }
}

$(document).ready(function () {
    socket = new io.Socket(null, {port: 5000});
    socket.connect();
    socket.on('message', function(msg){msgReceived(msg)});
    
    FB.init({ 
        appId:'268047249892587',
        cookie:true, 
        status:true,
        xfbml:true,
        oath:true 
    });
    
    if (window.location.pathname != '/') {
        FB.getLoginStatus(function(response) {
            if (response.status != "connected") {
                window.location = "/";
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
