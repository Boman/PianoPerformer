var windowWidth;
var windowHeight;

var images = [];

var song;

// gui elements
var stage;
var scrollPane;
var pianoBar;
var keyPane;
var controlBar;

// status variables
var stop = true;
var playing;
var speed;
var songPosition; // in seconds

// dimensions
var whiteKeyWidth;
var whiteKeyHeight;
var keyOffsetX;
var keyScale;

var controlBarHeight = 40;

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
				}, "libs/midi.js/soundfont/soundfont-ogg.js");
			} else {
				// status variables
				stop = false;
				playing = false;
				speed = 1;
				songPosition = -1;

				createGUI();

				$(window).resize(function() {
					resizeGUI(true);
				});

				// register key functions
				document.onkeyup = handleKeyUp;

				// start
				stage.update();
				lastTick = new Date();
				tick();
			}
		}
	}
}

function createGUI() {
	resizeGUI(false);

	stage = new Stage($("#mainCanvas").get(0));
	stage.snapToPixel = true;
	Touch.enable(stage);

	// scrollPane
	scrollPane = new ScrollPane(windowWidth - 2 * keyOffsetX, windowHeight - whiteKeyHeight - controlBarHeight - 5);
	scrollPane.x = keyOffsetX;
	scrollPane.drawNotes();
	stage.addChild(scrollPane);
	// bar between notes and keys
	pianoBar = new Bitmap(images["pianoBar"]);
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
}

function resizeGUI(resizeComponents) {
	if (windowWidth != $("#mainCanvas").width() || windowHeight != $("#mainCanvas").height()) {
		windowWidth = $("#mainCanvas").width();
		windowHeight = $("#mainCanvas").height();

		$("#mainCanvas").attr({
			width : windowWidth,
			height : windowHeight
		});

		// calculate dimensions
		whiteKeyWidth = Math.floor(windowWidth / 52);
		whiteKeyHeight = Math.floor(whiteKeyWidth * 177 / 28);
		keyOffsetX = Math.floor((windowWidth - 52 * whiteKeyWidth) / 2);
		keyScale = whiteKeyWidth / 28;

		if (resizeComponents) {
			scrollPane.resize(windowWidth - 2 * keyOffsetX, windowHeight - whiteKeyHeight - controlBarHeight - 5);
			scrollPane.x = keyOffsetX;
			pianoBar.setTransform(keyOffsetX, windowHeight - whiteKeyHeight - controlBarHeight - 5, whiteKeyWidth * 52,
					1);
			keyPane.resize(whiteKeyWidth * 52, whiteKeyHeight);
			keyPane.x = keyOffsetX;
			keyPane.y = windowHeight - whiteKeyHeight - controlBarHeight;
			controlBar.resize(whiteKeyWidth * 52, controlBarHeight);
			controlBar.x = keyOffsetX;
			controlBar.y = windowHeight - controlBarHeight;
		}
	}
}

function playPause(play) {
	playing = play;
	if (play) {
		controlBar.playPauseButton.image = images["pause"];
		// start the song again
		if (songPosition >= song.songDuration + 1) {
			songPosition = -1;
		}
	} else {
		controlBar.playPauseButton.image = images["play"];
	}
}

// FPS variables
var numFrames = 0;
var cummulatedTime = 0;
var actualFPS = 0;

var lastTick;
function tick() {
	var tickTime = new Date();
	var delta = Math.min(tickTime - lastTick, 1000);
	if (!stop && delta > 10) {
		lastTick = tickTime;

		if (playing) {
			if (songPosition >= song.songDuration + 1) {
				playPause(false);
			} else {
				songPosition += delta * speed / 1000;
			}
		}

		scrollPane.tick(delta);
		song.tick(delta);
		controlBar.tick(delta);

		numFrames++;
		cummulatedTime += delta;
		if (numFrames > 20) {
			actualFPS = numFrames * 1000 / cummulatedTime;
			numFrames = 0;
			cummulatedTime = 0;
		}

		stage.update();
	}
	requestAnimFrame(tick);
}

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