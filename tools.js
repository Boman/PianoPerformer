window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
			|| window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
				window.setTimeout(callback, 1000 / 20);
			};
})();

var imagesToLoad = [ [ "whiteKey", "images/white_key.png" ], [ "whiteKeyPressed", "images/white_key_pressed.png" ],
		[ "blackKey", "images/black_key.png" ], [ "barGreen", "images/bar_green.png" ],
		[ "barGreenTop", "images/bar_green_top.png" ], [ "barGreenMiddle", "images/bar_green_middle.png" ],
		[ "barGreenBottom", "images/bar_green_bottom.png" ], [ "pianoBar", "images/piano_bar.png" ] ];

$(function() {
	loadImage();
});

function loadImage() {
	if (imagesToLoad.length <= 0) {
		init();
	} else {
		var img = new Image();
		var imageToLoad = imagesToLoad.shift();
		img.src = imageToLoad[1];
		images[imageToLoad[0]] = img;
		img.onload = loadImage;
	}
}
