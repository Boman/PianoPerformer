function loadSongs() {
	$.getJSON("resources/songs.json", function(data) {
		$.each(data, function(key, val) {
			$('#songTable > tbody:last').append(
					"<tr><td><a href='javascript:loadSong(\"" + key + "\")'>" + key + "</a></td></tr>");
		});
	});
}

function showMenu() {
	stop = true;
	$('#tabs').tabs().tabs('select', 'settingsTab');
}

var songFileName;
function loadSong(fileName) {
	$('#tabs').tabs().tabs('select', 'pianoTab');
	songFileName = "resources/" + fileName;
	initPiano();
}