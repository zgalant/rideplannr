$(document).ready(function () {
    var eid = $("#eid").html();
    
    $("[data-uid]").each(function() {
        var user_name = this;
        var uid = $(user_name).attr("data-uid");
        D.log(uid);
        $.ajax({
            type:"GET",
            url:"/ajax/get_user",
            data:{
                uid:uid,
            },
            dataType: 'JSON',
            success: function(response) {
                response = JSON.parse(response);
                var user = response.user;
                $(user_name).html(user.first_name + " " + user.last_name);
            }
        });
    });
    
    FB.getLoginStatus(function(response) {
        D.log(response);
        if (response.status == "connected") {
            var fbid = response.authResponse.userID;
            D.log(fbid);
            $("#add-ride-button").live('click', function() {
                socket.send({
                    type:"add_car",
                    fbid:fbid,
                    eid:eid,
                    path:window.location.pathname,
                });
            });
            
            $(".join-ride-button").live('click', function() {
                var rid = $(this).attr("data-rid");
                socket.send({
                    type:"join_car",
                    fbid:fbid,
                    rid:rid,
                    path:window.location.pathname,
                });
            });
        }
    });

});