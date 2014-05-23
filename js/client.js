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

var lastNotification = null;

function display_event(json){
	for( i in json) {
		switch(json[i].type){
			case 'notification':
				lastNotification = json[i].content;
				showNotification();
			break;
		}
	}
}

$(document).ready(function() {
	//begin listening for updates right away
	longPoll_feed();

	if (!("Notification" in window)) {
		document.getElementById('enabledCheck').checked = false;
		document.getElementById('enabledCheck').disabled = true;
		document.getElementById('timeoutBox').disabled = true;
		alert('Sorry , your browser does not support desktop notifications.');
	} else {
		//check permissions
		showNotification();
	}
});

function RequestPermission (callback){
	Notification.requestPermission(callback);
}

function showNotification() {
	if (Notification.permission !== "granted") {
            RequestPermission(showNotification);
        } else {
		if(lastNotification === null)
			return;
		var iconstr = null;
		if(lastNotification.icon != undefined && lastNotification.icon != null && lastNotification.icon != "undefined" && lastNotification.icon != "null") {
			iconstr = lastNotification.icon.replace(/_/g,'/').replace(/-/g,'+');
		}
		if(lastNotification.sound != undefined && lastNotification.sound != null && lastNotification.sound != "undefined" && lastNotification.sound != "null") {
			soundstr = lastNotification.sound.replace(/_/g,'/').replace(/-/g,'+');
			if(document.getElementById('soundCheck').checked) {
				var audio = $('<audio>');
				var source = $('<source>').attr('src', soundstr).appendTo(audio);
				audio.bind('ended', function () { audio.remove(); });
				audio.appendTo('body');	
				audio[0].play();
			}
		}
		if(document.getElementById('enabledCheck').checked) {
			var popup = new Notification(lastNotification.app, { body: lastNotification.text, icon: iconstr });
		        //popup.show();
			var timeout = document.getElementById('timeoutBox').value;
			if(timeout && timeout != "" && !isNaN(timeout) && timeout > 0) {
			        setTimeout(function(){
					popup.close();
			        }, timeout * 1000);
			}
		}
		var row = '<tr><td class="spacer" colspan="3"/></tr>';
		row += '<tr><td rowspan="2">';
		if(iconstr !== null) {
			row += '<img src="' + iconstr + '"/>';
		}
		row += '</td><td class="appname">' + lastNotification.app + '</td>';
		row += '<td class="time">' + lastNotification.time + '</td>';
		row += '</tr><tr>';
		row += '<td class="text" colspan="2">';
		row += lastNotification.text;
		row += '</td></tr>';
		var rowDom = $(row);
		rowDom.bind("contextmenu", function (e) {
			rowDom.fadeOut('slow', function() { rowDom.remove() });
			return false;
		});
		rowDom.hide().prependTo('#notificationTable tbody').fadeIn('slow');
	}
}
