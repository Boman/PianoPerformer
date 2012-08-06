window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
			|| window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
				window.setTimeout(callback, 1000 / 50);
			};
})();

var imagesToLoad = [ [ "whiteKey", "images/white_key.png" ], [ "whiteKeyPressed", "images/white_key_pressed.png" ],
		[ "blackKey", "images/black_key.png" ], [ "blackKeyPressed", "images/black_key.png" ],
		[ "barGreen", "images/bar_green.png" ], [ "blackBarGreen", "images/black_bar_green.png" ],
		[ "barBlue", "images/bar_blue.png" ], [ "blackBarBlue", "images/black_bar_blue.png" ],
		[ "pianoBar", "images/piano_bar.png" ], [ "back", "images/back.png" ], [ "play", "images/play.png" ],
		[ "pause", "images/pause.png" ] ];

// usefull keycodes
var KEYCODE_ENTER = 13;
var KEYCODE_ESC = 27;
var KEYCODE_SPACE = 32;
var KEYCODE_UP = 38;
var KEYCODE_DOWN = 40;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;

function loadImages(onloadHandler) {
	if (imagesToLoad.length <= 0) {
		onloadHandler();
	} else {
		var img = new Image();
		var imageToLoad = imagesToLoad.shift();
		img.src = imageToLoad[1];
		images[imageToLoad[0]] = img;
		img.onload = function() {
			loadImages(onloadHandler);
		};
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
	var keyNumber = midiTone - 21;
	keyNumber += Math.floor(keyNumber / 12) * 2;
	if (keyNumber % 14 > 2) {
		keyNumber += 1;
	}
	if (keyNumber % 14 > 8) {
		keyNumber += 1;
	}
	return keyNumber;
}

function keyNumberToMidiTone(keyNumber) {
	var midiTone = keyNumber - Math.floor(keyNumber / 14) * 2;
	if (midiTone % 12 > 3) {
		midiTone -= 1;
	}
	if (midiTone % 12 > 7) {
		midiTone -= 1;
	}
	return midiTone + 21;
}

function getBlackKeyXOffset(key) {
	switch (key % 14) {
	case 1:
	case 7:
		return 0.28;
	case 13:
		return 0.2;
	case 5:
	case 11:
		return 0.12;
	default:
		return 0;
	}
}