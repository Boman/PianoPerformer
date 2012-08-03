window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
			|| window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
				window.setTimeout(callback, 1000 / 50);
			};
})();

var imagesToLoad = [ [ "whiteKey", "images/white_key.png" ], [ "whiteKeyPressed", "images/white_key_pressed.png" ],
		[ "blackKey", "images/black_key.png" ], [ "barGreen", "images/bar_green.png" ],
		[ "barGreenTop", "images/bar_green_top.png" ], [ "barGreenMiddle", "images/bar_green_middle.png" ],
		[ "barGreenBottom", "images/bar_green_bottom.png" ], [ "pianoBar", "images/piano_bar.png" ],
		[ "play", "images/play.png" ], [ "pause", "images/pause.png" ] ];

$(function() {
	loadImage();
});

function loadImage() {
	if (imagesToLoad.length <= 0) {
		loadMidi("resources/mozart_turkish_march.mid", init);
	} else {
		var img = new Image();
		var imageToLoad = imagesToLoad.shift();
		img.src = imageToLoad[1];
		images[imageToLoad[0]] = img;
		img.onload = loadImage;
	}
}

function timeToString(time) {
	var tmpTime = Math.floor(time);
	var string = Math.floor(tmpTime / 60) + ":";
	if (tmpTime % 60 < 10) {
		string += "0";
	}
	string += tmpTime % 60;
	return string;
}

function midiToneToKeyNumber(midiTone) {
	var keyNumber = midiTone - 57;
	keyNumber += Math.floor(keyNumber / 12) * 2;
	if (keyNumber % 14 > 2) {
		keyNumber += 1;
	}
	if (keyNumber % 14 > 8) {
		keyNumber += 1;
	}
	return keyNumber + 42;
}