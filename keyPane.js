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
	// read pressed Keys
	for ( var i = 0; i < notes.length; ++i) {
		if (notes[i].notePosition <= songPosition && notes[i].notePosition + notes[i].noteDuration >= songPosition) {
			var keyToPress = midiToneToKeyNumber(notes[i].noteNumber);
			newPressedKeys.push(keyToPress);
		}
	}
	for ( var i = 0; i < pressedKeys.length; ++i) {
		var keyStillPressed = false;
		for ( var j = 0; j < newPressedKeys.length; ++j) {
			if (pressedKeys[i] == newPressedKeys[j]) {
				keyStillPressed = true;
			}
		}
		if (!keyStillPressed) {
			console.log("off", keyNumberToMidiTone(pressedKeys[i]));
			MIDI.noteOff(MIDI.pianoKeyOffset, keyNumberToMidiTone(pressedKeys[i]), 0);
			if (pressedKeys[i] % 2 == 0) {
				keys[pressedKeys[i]].image = images["whiteKey"];
			} else {
				keys[pressedKeys[i]].image = images["blackKey"];
			}
		}
	}
	for ( var i = 0; i < newPressedKeys.length; ++i) {
		var keyAllreadyPressed = false;
		for ( var j = 0; j < pressedKeys.length; ++j) {
			if (newPressedKeys[i] == pressedKeys[j]) {
				keyAllreadyPressed = true;
			}
		}
		if (!keyAllreadyPressed) {
			if (playing) {
				console.log("on", keyNumberToMidiTone(newPressedKeys[i]));
				MIDI.noteOn(MIDI.pianoKeyOffset, keyNumberToMidiTone(newPressedKeys[i]), 127, 0);
			}
			if (newPressedKeys[i] % 2 == 0) {
				keys[newPressedKeys[i]].image = images["whiteKeyPressed"];
			} else {
				keys[newPressedKeys[i]].image = images["blackKeyPressed"];
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