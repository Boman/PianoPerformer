function ScrollPane(width, height) {
	this.initialize(width, height);
}

window.ScrollPane = ScrollPane;

var p = ScrollPane.prototype = new Container();

p.Container_initialize = p.initialize; // unique to avoid overiding base class

p.initialize = function(w, h) {
	this.Container_initialize();
	this.width = w;
	this.height = h;
	this.background = new Shape();
	this.scrollingNotes = new Container();
	this.addChild(this.background);
	this.addChild(this.scrollingNotes);

	this.pixelsPerSecond = 140;

	this.noteBars = [];
	for ( var i = 0; i < notes.length; ++i) {
		this.addNote(notes[i].notePosition, notes[i].noteDuration, midiToneToKeyNumber(notes[i].noteNumber), "Green");
	}
	this.scrollingNotes.cache(0, -songDuration * this.pixelsPerSecond, this.width, songDuration * this.pixelsPerSecond
			+ this.height);

	this.drawBackground();
	this.background.cache(0, 0, this.width, this.height);

	this.onPress = this.handlePress;
};

p.drawBackground = function() {
	var g = this.background.graphics;
	g.beginFill(Graphics.getRGB(60, 60, 60));
	g.rect(0, 0, this.width, this.height);
	g.endFill();

	g.setStrokeStyle(1);
	g.beginStroke(Graphics.getRGB(20, 20, 20));
	for ( var i = 1; i < 52; ++i) {
		if (i % 7 != 2 && i % 7 != 5) {
			var xPos = Math.floor(this.width * i / 52);
			g.moveTo(xPos, 0);
			g.lineTo(xPos, this.height);
		}
	}
};

p.addNote = function(time, length, tone, color) {
	if (tone % 2 == 0) {
		tone /= 2;
		var x = Math.floor(this.width * tone / 52);
		var y = Math.floor(-time * this.pixelsPerSecond + this.height);
		var height = Math.floor(length * this.pixelsPerSecond);
		var bitmap = new Bitmap(images["bar" + color + "Top"]);
		bitmap.setTransform(x, y - height);
		this.scrollingNotes.addChild(bitmap);
		var bitmap = new Bitmap(images["bar" + color + "Middle"]);
		bitmap.setTransform(x, y - height + 6, 1, height - 12);
		this.scrollingNotes.addChild(bitmap);
		var bitmap = new Bitmap(images["bar" + color + "Bottom"]);
		bitmap.setTransform(x, y - 6);
		this.scrollingNotes.addChild(bitmap);

		this.noteBars.push({
			tone : tone,
			length : length,
			color : color,
			time : time
		});
	}
};

p.tick = function(delta) {
	scrollPane.scrollingNotes.y = Math.floor(songPosition * scrollPane.pixelsPerSecond);
};

var playingBeforeDrag;
p.handlePress = function(event) {
	playingBeforeDrag = playing;
	playPause(false);
	scrollPane.mouseOffset = event.stageY;
	event.onMouseMove = this.handleMove;
	event.onMouseUp = function() {
		playPause(playingBeforeDrag);
	};
};

p.handleMove = function(event) {
	var newSongPosition = (scrollPane.scrollingNotes.y + event.stageY - scrollPane.mouseOffset)
			/ scrollPane.pixelsPerSecond;
	if (newSongPosition >= -2 && newSongPosition <= songDuration + 2) {
		songPosition = newSongPosition;
	}
	scrollPane.mouseOffset = event.stageY;
};