var Sequencer = function(timescale) {

	var c = 0;
	var startTime = new Date().getTime();

	var notes = [], numNotes;

	var onbeat = function(beat) {
		var n;

		for(var i = 0; i < numNotes; i++) {
			n = notes[i];
			if(beat < n.start) continue;
			var lb = beat - n.start;
			if(lb % n.frequency == 0 && (lb / n.frequency < n.count || !n.count)) n.note.play(timescale);
		}
	}

	this.addNote = function(note, start, frequency, count) {
		var n = {
			note: note,
			start:start,
			frequency: frequency,
			count: count
		};

		notes.push(n);
		numNotes = notes.length;
	}

	this.removeNote = function(note) {
		// TODO: implement when necessary
	}

	this.update = function() {
		var nc = ((new Date().getTime() - startTime) / timescale) | 0;
		if(nc > c) onbeat(nc);
		c = nc;
	}
}