function loadMidi(midiFileName, handler) {
	loadRemote(midiFileName, function(data) {
		var midiFile = MidiFile(data);
		Replayer(midiFile);
		handler();
	});
}

function Replayer(midiFile) {
	var trackStates = [];
	var beatsPerMinute = 120;
	var ticksPerBeat = midiFile.header.ticksPerBeat;

	for ( var i = 0; i < midiFile.tracks.length; i++) {
		trackStates[i] = {
			'nextEventIndex' : 0,
			'ticksToNextEvent' : (midiFile.tracks[i].length ? midiFile.tracks[i][0].deltaTime : null)
		};
	}

	var finished = false;
	var eventPosition = 0;
	var secondsToNextEvent = 0;

	var nextEventInfo;

	function getNextEvent() {
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
			var nextEvent = midiFile.tracks[nextEventTrack][nextEventIndex];
			if (midiFile.tracks[nextEventTrack][nextEventIndex + 1]) {
				trackStates[nextEventTrack].ticksToNextEvent += midiFile.tracks[nextEventTrack][nextEventIndex + 1].deltaTime;
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

	getNextEvent();

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
				for ( var i = 0; i < notes.length; ++i) {
					if (notes[i].noteNumber == event.noteNumber && notes[i].noteDuration == 0) {
						notes[i].noteDuration = eventPosition - notes[i].notePosition;
					}
				}
				notes.push({
					notePosition : eventPosition,
					noteNumber : event.noteNumber,
					noteVelocity : event.velocity,
					noteDuration : 0
				});
				break;
			case 'noteOff':
				for ( var i = 0; i < notes.length; ++i) {
					if (notes[i].noteNumber == event.noteNumber && notes[i].noteDuration == 0) {
						notes[i].noteDuration = eventPosition - notes[i].notePosition;
					}
				}
				break;
			}
			break;
		}
	}

	while (!finished) {
		handleEvent();
		getNextEvent();
	}
}