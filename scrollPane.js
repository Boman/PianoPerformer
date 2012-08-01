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

	this.notes = [];
	this.addNote(52, 1, "Green", 0);
	this.addNote(56, 0.5, "Green", 0);
	this.addNote(56, 0.25, "Green", 0.75);

	this.drawBackground();

	this.onPress = this.handlePress;
};

p.drawBackground = function() {
	var g = this.background.graphics;
	g.beginFill(Graphics.getRGB(80, 80, 80));
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

p.addNote = function(tone, length, color, time) {
	if (tone % 2 == 0) {
		tone /= 2;
		var x = Math.floor(this.width * tone / 52);
		var y = Math.floor(-time * 80);
		var height = Math.floor(length * 80);
		var bitmap = new Bitmap(images["bar" + color + "Top"]);
		bitmap.setTransform(x, y - height);
		this.scrollingNotes.addChild(bitmap);
		var bitmap = new Bitmap(images["bar" + color + "Middle"]);
		bitmap.setTransform(x, y - height + 6, 1, height - 12);
		this.scrollingNotes.addChild(bitmap);
		var bitmap = new Bitmap(images["bar" + color + "Bottom"]);
		bitmap.setTransform(x, y - 6);
		this.scrollingNotes.addChild(bitmap);

		this.notes.push({
			tone : tone,
			length : length,
			color : color,
			time : time
		});
	}
};

p.tick = function(delta) {
	this.scrollingNotes.y += delta / 20;
	// if ((this.bitmap.y < 0 && this.bitmap.speed < 0)
	// || (this.bitmap.y + this.bitmap.image.height > this.height &&
	// this.bitmap.speed > 0)) {
	// this.bitmap.speed *= -1;
	// }
	// this.bitmap.y += delta * this.bitmap.speed / 1000;
};

p.handlePress = function(event) {
	scrollPane.mouseOffset = event.stageY;
	event.onMouseMove = this.handleMove;
};

p.handleMove = function(event) {
	scrollPane.scrollingNotes.y += event.stageY - scrollPane.mouseOffset;
	scrollPane.mouseOffset = event.stageY;
};