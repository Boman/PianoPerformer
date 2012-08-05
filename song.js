function Song() {
	this.initialize();
}

window.Song = Song;

var p = Song.prototype;

p.initialize = function() {
	this.notes = [];
};

p.loadMidi = function(fileName, onloadHandler) {
	this.midiFileName = fileName;
	thisSong = this;
	this.songDuration = 0;
	loadRemote(fileName, function(data) {
		thisSong.midiFileData = MidiFile(data);
		thisSong.readMidiNotes();
		onloadHandler();
	});
};

p.readMidiNotes = function() {
	var trackStates = [];
	var beatsPerMinute = 120;
	var ticksPerBeat = this.midiFileData.header.ticksPerBeat;

	for ( var i = 0; i < this.midiFileData.tracks.length; i++) {
		trackStates[i] = {
			'nextEventIndex' : 0,
			'ticksToNextEvent' : (this.midiFileData.tracks[i].length ? this.midiFileData.tracks[i][0].deltaTime : null)
		};
	}

	var finished = false;
	var eventPosition = 0;
	var secondsToNextEvent = 0;

	var nextEventInfo;

	function getNextEvent(midiFileData) {
		var ticksToNextEvent = null;
		var nextEventTrack = null;
		var nextEventIndex = null;

		for ( var i = 0; i < trackStates.length; i++) {
			if (trackStates[i].ticksToNextEvent != null
					&& (ticksToNextEvent == null || trackStates[i].ticksToNextEvent < ticksToNextEvent)) {
				ticksToNextEvent = trackStates[i].ticksToNextEvent;
				nextEventTrack = i;
				nextEventIndex = trackStates[i].nextEventIndex;
			}
		}
		if (nextEventTrack != null) {
			/* consume event from that track */
			var nextEvent = midiFileData.tracks[nextEventTrack][nextEventIndex];
			if (midiFileData.tracks[nextEventTrack][nextEventIndex + 1]) {
				trackStates[nextEventTrack].ticksToNextEvent += midiFileData.tracks[nextEventTrack][nextEventIndex + 1].deltaTime;
			} else {
				trackStates[nextEventTrack].ticksToNextEvent = null;
			}
			trackStates[nextEventTrack].nextEventIndex += 1;
			/* advance timings on all tracks by ticksToNextEvent */
			for ( var i = 0; i < trackStates.length; i++) {
				if (trackStates[i].ticksToNextEvent != null) {
					trackStates[i].ticksToNextEvent -= ticksToNextEvent;
				}
			}
			nextEventInfo = {
				'ticksToEvent' : ticksToNextEvent,
				'event' : nextEvent,
				'track' : nextEventTrack
			};
			var beatsToNextEvent = ticksToNextEvent / ticksPerBeat;
			secondsToNextEvent = beatsToNextEvent / (beatsPerMinute / 60);
		} else {
			nextEventInfo = null;
			finished = true;
		}
	}

	getNextEvent(this.midiFileData);

	function handleEvent() {
		var event = nextEventInfo.event;
		eventPosition += secondsToNextEvent;
		switch (event.type) {
		case 'meta':
			switch (event.subtype) {
			case 'setTempo':
				beatsPerMinute = 60000000 / event.microsecondsPerBeat;
			}
			break;
		case 'channel':
			switch (event.subtype) {
			case 'noteOn':
				// look if note is already pressed
				for ( var i = 0; i < this.notes.length; ++i) {
					if (this.notes[i].noteNumber == event.noteNumber && this.notes[i].noteDuration == 0) {
						this.notes[i].noteDuration = eventPosition - this.notes[i].notePosition;
					}
				}
				this.notes.push({
					notePosition : eventPosition,
					noteNumber : event.noteNumber,
					noteVelocity : event.velocity,
					noteDuration : 0
				});
				break;
			case 'noteOff':
				for ( var i = 0; i < this.notes.length; ++i) {
					if (this.notes[i].noteNumber == event.noteNumber && this.notes[i].noteDuration == 0) {
						this.notes[i].noteDuration = eventPosition - this.notes[i].notePosition;
					}
				}
				break;
			}
			break;
		}
	}

	while (!finished) {
		handleEvent();
		getNextEvent(this.midiFileData);
		this.songDuration = eventPosition;
	}
};