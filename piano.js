var windowWidth;
var windowHeight;

var images = [];

var song;

// gui elements
var stage;
var scrollPane;
var keyPane;
var controlBar;

// status variables
var playing;
var speed;
var songPosition; // in seconds
var notes = [];

// dimensions
var whiteKeyWidth;
var whiteKeyHeight;
var keyOffsetX;
var keyScale;

var controlBarHeight = 70;

var midjsLoaded = false;
function initPiano() {
	if (imagesToLoad.length != 0) {
		loadImages(initPiano);
	} else {
		if (!song || song.midiFileName != songFileName) {
			song = new Song();
			song.loadMidi(songFileName, initPiano);
		} else {
			if (!midjsLoaded) {
				MIDI.loadPlugin(function() {
					midjsLoaded = true;
					initPiano();
				}, "/libs/midi.js/soundfont/soundfont-ogg.js");
			} else {
				// status variables
				playing = false;
				speed = 1;
				songPosition = -1;

				createGUI();
			}
		}
	}
}

function createGUI() {
	windowWidth = $(document).width() - 1;
	windowHeight = $(document).height() - 1;

	$("#mainCanvas").attr({
		width : windowWidth,
		height : windowHeight
	});

	stage = new Stage($("#mainCanvas").get(0));
	stage.snapToPixel = true;
	Touch.enable(stage);

	// calculate dimensions
	whiteKeyWidth = Math.floor(windowWidth / 52);
	whiteKeyHeight = Math.floor(whiteKeyWidth * 177 / 28);
	keyOffsetX = Math.floor((windowWidth - 52 * whiteKeyWidth) / 2);
	keyScale = whiteKeyWidth / 28;
	// scrollPane
	scrollPane = new ScrollPane(windowWidth - 2 * keyOffsetX, windowHeight - whiteKeyHeight - controlBarHeight - 5);
	scrollPane.x += keyOffsetX;
	stage.addChild(scrollPane);
	// bar between notes and keys
	var pianoBar = new Bitmap(images["pianoBar"]);
	stage.addChild(pianoBar);
	pianoBar.setTransform(keyOffsetX, windowHeight - whiteKeyHeight - controlBarHeight - 5, whiteKeyWidth * 52, 1);
	// keyPane
	keyPane = new KeyPane(whiteKeyWidth * 52, whiteKeyHeight);
	keyPane.x = keyOffsetX;
	keyPane.y = windowHeight - whiteKeyHeight - controlBarHeight;
	stage.addChild(keyPane);
	// controlBar
	controlBar = new ControlBar(whiteKeyWidth * 52, controlBarHeight);
	controlBar.x = keyOffsetX;
	controlBar.y = windowHeight - controlBarHeight;
	stage.addChild(controlBar);

	// start
	stage.update();
	lastTick = new Date();
	tick();
}

function playPause(play) {
	playing = play;
	if (play) {
		controlBar.playPauseButton.image = images["pause"];
	} else {
		controlBar.playPauseButton.image = images["play"];
	}
}

var numFrames = 0;
var cummulatedTime = 0;
var actualFPS = 0;

var lastTick;
function tick() {
	var tickTime = new Date();
	var delta = Math.min(tickTime - lastTick, 1000);
	lastTick = tickTime;

	if (playing) {
		if (songPosition >= song.songDuration + 1) {
			playPause(false);
		} else {
			songPosition += delta * speed / 1000;
		}
	}

	scrollPane.tick(delta);
	keyPane.tick(delta);
	controlBar.tick(delta);

	numFrames++;
	cummulatedTime += delta;
	if (numFrames > 20) {
		actualFPS = numFrames * 1000 / cummulatedTime;
		numFrames = 0;
		cummulatedTime = 0;
	}

	stage.update();
	requestAnimFrame(tick);
}

// register key functions
document.onkeyup = handleKeyUp;

function handleKeyUp(e) {
	// cross browser issues exist
	if (!e) {
		var e = window.event;
	}
	switch (e.keyCode) {
	case KEYCODE_SPACE:
		playPause(!playing);
		return false;
	case KEYCODE_LEFT:
		songPosition = Math.max(0, songPosition) - 2;
		return false;
	case KEYCODE_RIGHT:
		songPosition = Math.min(song.songDuration, songPosition) + 2;
		return false;
	case KEYCODE_UP:
		speed += 0.1;
		return false;
	case KEYCODE_DOWN:
		speed -= 0.1;
		return false;
	case KEYCODE_ENTER:
		return false;
	case KEYCODE_ESC:
		showMenu();
		return false;
	}
}