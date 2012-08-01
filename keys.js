function KeyPane(width, height) {
	this.initialize(width, height);
}

window.KeyPane = KeyPane;

var p = KeyPane.prototype = new Container();

p.Container_initialize = p.initialize; // unique to avoid overiding base class

p.initialize = function(w, h) {
	this.Container_initialize();
	this.width = w;
	this.height = h;
	
	this.keys = new Array(4 * 52);

	// white keys
	for ( var i = 0; i < 52; ++i) {
		var key = this.addKey("whiteKeyPressed", i * keyWidth, 0, keyScale);
		key.hidden = false;
		this.keys[i + 52] = key;

		var key = this.addKey("whiteKey", i * keyWidth, 0, keyScale);
		key.hidden = false;
		this.keys[i] = key;
	}

	// black keys
	for ( var i = 0; i < 51; ++i) {
		var x = 0;
		switch ((i + 5) % 7) {
		case 0:
			x = 0.59;
			break;
		case 1:
			x = 0.79;
			break;
		case 3:
			x = 0.59;
			break;
		case 4:
			x = 0.69;
			break;
		case 5:
			x = 0.79;
			break;
		}
		if (x != 0) {
			var key = this.addKey("blackKey", Math.floor((i + x) * keyWidth), 0, keyScale);
			key.hidden = false;
			this.keys[i + 2 * 52] = key;
		}
	}
};

p.addKey = function(imgName, x, y, scale) {
	var bitmap = new Bitmap(images[imgName]);
	this.addChild(bitmap);
	bitmap.setTransform(x, y, scale, scale);
	return bitmap;
};