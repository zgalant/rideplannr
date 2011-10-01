
$(document).ready(function () {
    FB.init({ 
        appId:'268047249892587',
        cookie:true, 
        status:true,
        xfbml:true,
        oath:true 
    });

    
    FB.api('/me', function(user) {
        if(user != null) {
            $("#fbimage").attr('src', 'https://graph.facebook.com/' + user.id + '/picture');
            $("#name").html(user.name);
        }
    });


});