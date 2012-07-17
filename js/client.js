function longPoll_feed () {
	//make another request
	$.ajax({
			cache: false,
			dataType: 'json',
			type: "GET",
			url: "/node/phone/real_time_feed",
			error: function () {
				//don't flood the servers on error, wait 10 seconds before retrying
				setTimeout(longPoll_feed, 10*1000);
			},
			success: function (json) {
				display_event(json);

				//if everything went well, begin another request immediately
				//the server will take a long time to respond
				//how long? well, it will wait until there is another message
				//and then it will return it to us and close the connection.
				//since the connection is closed when we get data, we longPoll again
				longPoll_feed();
			}
		});
}

var notification = null;

function display_event(jsonstr){
	// oh so hacky :(
	jsonstr = JSON.stringify(jsonstr);
	jsonstr = jsonstr.substring(3, jsonstr.length - 6).replace(/\\\\/g,"\\").replace(/\\\"/g,"\"");
	json = JSON.parse(jsonstr); 
	
	switch(json.type){
		case 'notification':
			notification = json.content;
			showNotification();
		break;
	}
}

$(document).ready(function() {
	//begin listening for updates right away
	longPoll_feed();
});

if (!window.webkitNotifications) {
	alert('Sorry , your browser does not support desktop notifications.');
}

function RequestPermission (callback){
	window.webkitNotifications.requestPermission(callback);
}

function showNotification() {
	if (window.webkitNotifications.checkPermission() > 0) {
            RequestPermission(showNotification);
        } else {
	        var popup = window.webkitNotifications.createHTMLNotification('notification.php?time=' + notification.time + '&app=' + notification.app + '&text=' + notification.text + '&num=' + notification.num + '&icon=' + notification.icon + '&iconPadding=' + notification.iconPadding);
		//var popup = window.webkitNotifications.createNotification(null, notification.app, notification.text);
	        popup.show();
		var timeout = document.getElementById('timeoutBox').value;
		if(timeout && timeout != "" && timeout > 0) {
		        setTimeout(function(){
				popup.cancel();
		        }, timeout);
		}
	}
}
