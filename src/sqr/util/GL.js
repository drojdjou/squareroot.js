SQR.GL = (function() {

	var s = {}, gl;

	var currentProgram = null;
	var currentGeometry = null;

	s.POINTS                         = 0x0000;
    s.LINES                          = 0x0001;
    s.LINE_LOOP                      = 0x0002;
    s.LINE_STRIP                     = 0x0003;
    s.TRIANGLES                      = 0x0004;
    s.TRIANGLE_STRIP                 = 0x0005;
    s.TRIANGLE_FAN                   = 0x0006;

    s.STREAM_DRAW                    = 0x88E0;
    s.STATIC_DRAW                    = 0x88E4;
    s.DYNAMIC_DRAW                   = 0x88E8;

    s.FLOAT_VEC2                     = 0x8B50;
    s.FLOAT_VEC3                     = 0x8B51;
    s.FLOAT_VEC4                     = 0x8B52;

	s.init = function(_gl) {
		gl = _gl;

	}

	s.useProgram = function(program, forceSwitch) {
		if(!forceSwitch && currentProgram == program) return false;
		gl.useProgram(program);
		currentProgram = program;
		return true;
	}

	s.isNewGeometry = function(geometry) {
		var r = (geometry != currentGeometry);
		currentGeometry = geometry;
		return r;
	}

	return s;

})();