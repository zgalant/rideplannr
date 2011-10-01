function onLogin() {
    FB.api('/me', function(user) {
        $.post("/login", {fbuser:user}, function(data) {
            data = JSON.parse(data);
            console.log(data);
            window.location = "/user/" + data.user._id;
        });
    });
}



$(document).ready(function () {
    FB.init({ 
        appId:'268047249892587',
        cookie:true, 
        status:true,
        xfbml:true,
        oath:true 
    });

    FB.getLoginStatus(function(response) {
        if (response.status == "connected") {
            onLogin();
        }
    });

    $("#login-button").live('click', function() {
        FB.login(function(response) {
            if (response.status == "connected") {
                onLogin();
            } else {
                console.log('grrr');
            }

        }, {
            scope: 'email'
        });
    });


});
