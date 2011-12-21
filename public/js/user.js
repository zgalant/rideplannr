
$(document).ready(function () {
    var fbid = $("#fbid").html();
    FB.getLoginStatus(function(response) {
        if (response.status == "connected") {
            FB.api('/' + fbid, function(user) {
                D.log(user);
            });
        }
    });
});