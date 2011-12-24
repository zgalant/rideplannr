$(document).ready(function () {
    var gid = $("#gid").html();
    
    FB.getLoginStatus(function(response) {
        D.log(response);
        if (response.status == "connected") {
            var fbid = response.authResponse.userID;
            D.log(fbid);
            
            $("#add-event-button").live('click', function() {
                D.log(socket);
                var event_name = $("#add-event-name").val();
                var event_info = $("#add-event-info").val();
                socket.send({
                    type:"add_event",
                    group:gid,
                    event_name:event_name,
                    event_info:event_info,
                    path:window.location.pathname,
                });
            });

            $("#show-event-popup").live('click', function() {
                $("#new-popup").removeClass("gone");
            });

            $("#add-event-button").live('click', function() {
                $("#new-popup input, #new-popup textarea").val("");
                $(".popup").addClass("gone");
            });

            $("#join-group-button").live('click', function() {
                socket.send({
                    type:"join_group",
                    group_id:gid,
                    fbid:fbid,
                    path:window.location.pathname,
                });
            });
            
        }
    });
    
});