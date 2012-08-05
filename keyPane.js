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
		key.hidden = false;
		keys[i * 2] = key;
	}

	// black keys
	for ( var i = 0; i < 51; ++i) {
		var blackKeyXOffset = getBlackKeyXOffset(i * 2 + 1);
		if (blackKeyXOffset != 0) {
			var key = this.addKey("blackKey", Math.floor((i + 0.5 + blackKeyXOffset) * whiteKeyWidth), 0, keyScale);
			key.hidden = false;
			keys[i * 2 + 1] = key;
		}
	}

	// this.cache(0, 0, this.width, this.height);
};

var pressedKeys = [];

p.tick = function(delta) {
	var newPressedKeys = [];
	for ( var i = 0; i < pressedKeys.length; ++i) {
		if (pressedKeys[i] % 2 == 0) {
			keys[pressedKeys[i]].image = images["whiteKey"];
		} else {
			keys[pressedKeys[i]].image = images["blackKey"];
		}
	}
	// read pressed Keys
	for ( var i = 0; i < notes.length; ++i) {
		if (notes[i].notePosition <= songPosition && notes[i].notePosition + notes[i].noteDuration >= songPosition) {
			var keyToPress = midiToneToKeyNumber(notes[i].noteNumber);
			newPressedKeys.push(keyToPress);
			if (keyToPress % 2 == 0) {
				keys[keyToPress].image = images["whiteKeyPressed"];
			} else {
				keys[keyToPress].image = images["blackKeyPressed"];
			}
		}
	}
	pressedKeys = newPressedKeys;
};

p.addKey = function(imgName, x, y, scale) {
	var bitmap = new Bitmap(images[imgName]);
	this.addChild(bitmap);
	bitmap.setTransform(x, y, scale, scale);
	bitmap.snapToPixel = true;
	return bitmap;
};