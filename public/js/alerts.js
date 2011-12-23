Alerts = {};

Alerts.alert_user = function(text, user) {
    if (user == cur_user) {
        alert(text);
    }
}