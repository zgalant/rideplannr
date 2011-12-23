
$(document).ready(function () {
    var fbid = $("#fbid").html();
    FB.getLoginStatus(function(response) {
        if (response.status == "connected") {
            FB.api('/' + fbid, function(user) {
                D.log(user);
            });
        }
    });
    
    $("#add-group-button").live('click', function() {
        D.log(socket);
        var group_name = $("#add-group-name").val();
        var group_info = $("#add-group-info").val();
        socket.send({
            type:"join_group",
            group_name:group_name,
            group_info:group_info,
            fbid:fbid,
            path:window.location.pathname,
        });
    });
    
    $("#show-group-popup").live('click', function() {
        $("#new-popup").removeClass("gone");
    });
    
    $("#add-group-button").live('click', function() {
        $("#new-popup input, #new-popup textarea").val("");
        $(".popup").addClass("gone");
    });
    
});