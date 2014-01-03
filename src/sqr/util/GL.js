SQR.GL = (function() {

	var s = {}, gl;

	var currentProgram = null;
	var currentVBuffer = null;

	s.init = function(_gl) {
		gl = _gl;

	}

	s.useProgram = function(program, forceSwitch) {
		if(!forceSwitch && currentProgram == program) return;
		gl.useProgram(program);
		currentProgram = program;
	}

	return s;

})();