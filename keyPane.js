function KeyPane(width, height) {
	this.initialize(width, height);
}

window.KeyPane = KeyPane;

var p = KeyPane.prototype = new Container();

p.Container_initialize = p.initialize; // unique to avoid overiding base class

keys = new Array(2 * 52);

p.initialize = function(w, h) {
	this.Container_initialize();
	this.width = w;
	this.height = h;
	this.snapToPixel = true;

	// white keys
	for ( var i = 0; i < 52; ++i) {
		var key = this.addKey("whiteKey", i * whiteKeyWidth, 0, keyScale);
		keys[i * 2] = key;
	}

	// black keys
	for ( var i = 0; i < 51; ++i) {
		var blackKeyXOffset = getBlackKeyXOffset(i * 2 + 1);
		if (blackKeyXOffset != 0) {
			var key = this.addKey("blackKey", Math.floor((i + 0.5 + blackKeyXOffset) * whiteKeyWidth), 0, keyScale);
			keys[i * 2 + 1] = key;
		}
	}

	// this.cache(0, 0, this.width, this.height);
};

p.resize = function(w, h) {
	this.width = w;
	this.height = h;
	for ( var i = 0; i < 52; ++i) {
		keys[i * 2].setTransform(i * whiteKeyWidth, 0, keyScale, keyScale);
	}
	for ( var i = 0; i < 51; ++i) {
		var blackKeyXOffset = getBlackKeyXOffset(i * 2 + 1);
		if (blackKeyXOffset != 0) {
			keys[i * 2 + 1]
					.setTransform(Math.floor((i + 0.5 + blackKeyXOffset) * whiteKeyWidth), 0, keyScale, keyScale);
		}
	}
};

// helper function for adding key bitmaps
p.addKey = function(imgName, x, y, scale) {
	var bitmap = new Bitmap(images[imgName]);
	this.addChild(bitmap);
	bitmap.setTransform(x, y, scale, scale);
	bitmap.snapToPixel = true;
	return bitmap;
};

// function for letting a key look like pressed or not
p.changeKey = function(pressed, keyNumber) {
	if (pressed) {
		if (keyNumber % 2 == 0) {
			keys[keyNumber].image = images["whiteKeyPressed"];
		} else {
			keys[keyNumber].image = images["blackKeyPressed"];
		}

	} else {
		if (keyNumber % 2 == 0) {
			keys[keyNumber].image = images["whiteKey"];
		} else {
			keys[keyNumber].image = images["blackKey"];
		}
	}
};