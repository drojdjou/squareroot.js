SQR.GL = (function() {

	var s = {}, gl;

	var currentProgram = null;
	var currentGeometry = null;

	s.init = function(_gl) {
		gl = _gl;

	}

	s.useProgram = function(program, forceSwitch) {
		if(!forceSwitch && currentProgram == program) return;
		gl.useProgram(program);
		currentProgram = program;
	}

	s.isNewGeometry = function(geometry) {
		var r = (geometry != currentGeometry);
		currentGeometry = geometry;
		return r;
	}

	return s;

})();