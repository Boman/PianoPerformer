function ControlBar(width, height) {
	this.initialize(width, height);
}

window.ControlBar = ControlBar;

var p = ControlBar.prototype = new Container();

p.Container_initialize = p.initialize; // unique to avoid overiding base class

p.initialize = function(w, h) {
	this.Container_initialize();
	this.width = w;
	this.height = h;

	this.backGroundGraphics = new Graphics();
	this.backGroundGraphics.beginFill(Graphics.getRGB(68, 68, 68));
	this.backGroundGraphics.rect(0, 0, this.width, this.height);
	this.backGroundGraphics.endFill();
	var background = new Shape(this.backGroundGraphics);
	this.addChild(background);

	this.playPauseButton = new Bitmap(images["play"]);
	this.addChild(this.playPauseButton);
	this.playPauseButton.onPress = handlePlayPausePress;
	this.playPauseButton.setTransform(10, 10);

	this.progressText = new Text("", "14px bold Arial Black", Graphics.getRGB(180, 230, 70));
	this.progressText.x = 98;
	this.progressText.y = 20;
	this.addChild(this.progressText);

	this.fpsText = new Text("", "14px bold Arial Black", Graphics.getRGB(180, 230, 70));
	this.fpsText.x = 250;
	this.fpsText.y = 20;
	this.addChild(this.fpsText);
};

function handlePlayPausePress(event) {
	playPause(controlBar.playPauseButton.image == images["play"]);
};

p.tick = function(delta) {
	var tmpSongPosition = Math.min(songDuration, Math.max(0, songPosition));

	this.progressText.text = timeToString(tmpSongPosition) + " / " + timeToString(songDuration);

	var width = Math.floor(120 * tmpSongPosition / songDuration);
	this.backGroundGraphics.beginFill(Graphics.getRGB(140, 200, 60));
	this.backGroundGraphics.rect(70, 25, width, 15);
	this.backGroundGraphics.endFill();
	this.backGroundGraphics.beginFill(Graphics.getRGB(80, 80, 80));
	this.backGroundGraphics.rect(70 + width, 25, 120 - width, 15);
	this.backGroundGraphics.endFill();

	this.fpsText.text = Math.floor(actualFPS * 10) / 10 + " FPS";
};