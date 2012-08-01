var windowWidth;
var windowHeight;

var images = [];

// gui elements
var stage;
var scrollPane;
var keyPane;
var controlBar;

// status variables
var playing;

// dimensions
var keyWidth;
var keyHeight;
var keyOffsetX;
var keyScale;

function init() {
	windowWidth = $(window).width() - 25;
	windowHeight = $(window).height() - 25;

	$("#mainCanvas").attr({
		width : windowWidth,
		height : windowHeight
	});

	stage = new Stage($("#mainCanvas").get(0));
	Touch.enable(stage);

	// calculate dimensions
	keyWidth = Math.floor(windowWidth / 52);
	keyHeight = Math.floor(keyWidth * 177 / 28);
	keyOffsetX = Math.floor((windowWidth - 52 * keyWidth) / 2);
	keyScale = keyWidth / 28;
	// scrollPane
	scrollPane = new ScrollPane(windowWidth - 2 * keyOffsetX, windowHeight - keyHeight - 55);
	scrollPane.x += keyOffsetX;
	stage.addChild(scrollPane);
	// bar between notes and keys
	var pianoBar = new Bitmap(images["pianoBar"]);
	stage.addChild(pianoBar);
	pianoBar.setTransform(keyOffsetX, windowHeight - keyHeight - 55, keyWidth * 52, 1);
	// keyPane
	keyPane = new KeyPane(keyWidth * 52, keyHeight);
	keyPane.x = keyOffsetX;
	keyPane.y = windowHeight - keyHeight - 50;
	stage.addChild(keyPane);
	// controlBar
	
	// status variables
	playing = false;
	speed = 1;
	position = 0;
	
	// start
	stage.update();
	lastTick = new Date();
	tick();
}

var numFrames = 0;
var cummulatedTime = 0;
var lastTick;
function tick() {
	var tickTime = new Date();
	var delta = Math.min(tickTime - lastTick, 1000);
	lastTick = tickTime;

	scrollPane.tick(delta);

	// numFrames++;
	// cummulatedTime += delta;
	// if (numFrames > 10) {
	// console.log("FPS: " + (numFrames * 1000 / cummulatedTime));
	// numFrames = 0;
	// cummulatedTime = 0;
	// }

	stage.update();
	requestAnimFrame(tick);
}