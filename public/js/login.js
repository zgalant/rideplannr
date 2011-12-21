function onLogin() {
    FB.api('/me', function(user) {
        console.log(user);
        $.post("/login", {fbuser:user}, function(data) {
            D.log('logged in');
            data = JSON.parse(data);
            console.log(data);
            window.location = "/user/" + data.user.fbid;
        });
        // window.location = "/user/" + user.id;
    });
}



$(document).ready(function () {
    FB.getLoginStatus(function(response) {
        if (response.status == "connected") {
            onLogin();
        }
    });

    $("#login-button").live('click', function() {
        FB.login(function(response) {
            if (response.authResponse) {
                onLogin();
            } else {
                console.log('bad fb login');
            }

        }, {
            scope: 'email'
        });
    });


});
