function loadSongs() {
	$.getJSON("resources/songs.json", function(data) {
		$.each(data, function(key, val) {
			$('#songTable > tbody:last').append(
					"<tr><td><a href='javascript:loadSong(\"" + key + "\")'>" + key + "</a></td></tr>");
		});
	});
}

function showMenu() {
	$('#mainCanvas').hide();
	$('#mainMenu').show();
}

var songFileName;
function loadSong(fileName) {
	$('#mainMenu').hide();
	$('#mainCanvas').show();
	songFileName = "resources/" + fileName;
	initPiano();
}