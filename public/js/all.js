D = console;
function msgReceived(msg){
    switch (msg.type) {
        case "existing_user":
            window.location = "/";
            break;
        case "new_user":
            break;
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
