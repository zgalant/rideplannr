D = console;
function msgReceived(msg){
    if (msg.path == window.location.pathname) {
        switch (msg.type) {
            case "join_group":
                $("#group-list").append("<div><a href='/group/" + msg.group._id + "'>" + msg.group.name + "</a></div>");
                break;
            case "add_event":
                $("#event-list").append("<div><a href='/event/" + msg.event._id + "'>" + msg.event.name + "</a></div>");
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
    

});
