
$(document).ready(function () {
    var fbid = $("#fbid").html();
    FB.getLoginStatus(function(response) {
        if (response.status == "connected") {
            FB.api('/' + fbid, function(user) {
                D.log(user);
            });
        }
        
        $("#add-event-button").live('click', function() {
            D.log(socket);
            var event_name = $("#add-event-name").val();
            var event_info = $("#add-event-info").val();
            socket.send({
                type:"add_event",
                group:null,
                event_name:event_name,
                event_info:event_info,
                uid:fbid,
                path:window.location.pathname,
            });
        });

        $("#show-event-popup").live('click', function() {
            $("#add-event-popup").removeClass("gone");
        });

        $("#add-event-button").live('click', function() {
            $("#add-event-popup input, #add-event-popup textarea").val("");
            $(".popup").addClass("gone");
        });
        
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
        $("#add-group-popup").removeClass("gone");
    });
    
    $("#add-group-button").live('click', function() {
        $("#add-group-popup input, #add-group-popup textarea").val("");
        $(".popup").addClass("gone");
    });
    
    $("#group-search-input").live('keydown keypress keyup focus paste', function() {
        var q = $(this).val();
        $.ajax({
            type:"GET",
            url:"/ajax/group_search",
            data:{
                q:q,
            },
            dataType: 'JSON',
            success: function(response) {
                response = JSON.parse(response);
                var groups = response.groups;
                $("#group-search-list").html("");
                $(groups).each(function(index, group) {
                    $.tmpl(Markup.group_listing_markup, {group:group}).appendTo("#group-search-list");
                });
                
            }
        });
    });
    
});