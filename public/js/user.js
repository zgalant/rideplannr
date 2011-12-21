
$(document).ready(function () {
    var fbid = $("#fbid").html();
    FB.getLoginStatus(function(response) {
        if (response.status == "connected") {
            FB.api('/' + fbid, function(user) {
                D.log(user);
            });
        }
    });
    
    $("#join-group-button").live('click', function() {
        D.log(socket);
        var group_name = $("#join-group-input").val();
        socket.send({
            type:"join_group",
            group_name:group_name,
            fbid:fbid,
        });
    });
    
});