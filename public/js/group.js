$(document).ready(function () {
    var gid = $("#gid").html();
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
        $("#new-event-popup").removeClass("gone");
    });
    
    $("#add-event-button").live('click', function() {
        $("#new-event-popup input, #new-event-popup textarea").val("");
        $(".popup").addClass("gone");
    });
    
});