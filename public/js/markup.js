Markup = {};

Markup.group_listing_markup = "<a href='/group/${group._id}' class='group'><div>${group.name}</div></a>";


Markup.evnt_listing_markup = "<a href='/event/${event._id}' class='event'><div>${event.name}</div></a>";
Markup.ride_listing_markup = 
                        "<div data-rid='${ride._id}' class='ride-listing'>\
                            <div class='driver'>\
                                <img class='user-image driver-image'\
                                    src='http://graph.facebook.com/${driver.fbid}/picture?type=square' />\
                                <div class='driver-info'>\
                                    <div class='user-name driver-name'>${driver.first_name} ${driver.last_name}</div>\
                                    <div class='clear'></div>\
                                    <div class='ride-notes'>${ride.notes}</div>\
                                </div>\
                                <div class='join-ride-buttons'>\
                                    <div class='hopin'>Hop in:</div>\
                                    <button class='join-ride-there' type='submit' data-rid='${ride._id}'>Way There</button>\
                                    <button class='join-ride-back' type='submit' data-rid='${ride._id}'>Way Back</button>\
                                    <button class='join-ride-both' type='submit' data-rid='${ride._id}'>Both</button>\
                                </div>\
                            </div>\
                            <div class='clear'></div>\
                            <div class='riders-list way-there' data-rid='${ride._id}'>\
                                <div class='rider'>Way There (${seats.there} spots) Leaving: ${leaving}</div>\
                            </div>\
                            <div class='riders-list way-back' data-rid='${ride._id}'>\
                                <div class='rider'>Way Back (${seats.back} spots) Returning: ${returning}</div>\
                            </div>\
                        </div>";
                        
Markup.rider_in_car_markup = "<div class='rider'>\
                        <img class='user-image rider-image'\
                            src='http://graph.facebook.com/${rider.fbid}/picture?type=square' />\
                        <div class='user-name rider-name'>${rider.first_name} ${rider.last_name}</div>\
                    </div><div class='clear'></div>";
                    
                    