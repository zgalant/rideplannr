$(document).ready(function () {
    var gid = $("#gid").html();
    $("#add-event-button").live('click', function() {
        D.log(socket);
        var event_name = $("#add-event-input").val();
        socket.send({
            type:"add_event",
            group:gid,
            event_name:event_name,
            path:window.location.pathname,
        });
    });
    
});