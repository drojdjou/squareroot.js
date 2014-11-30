SQR.Context = function(canvas) {

	if(!canvas) canvas = document.createElement('canvas');
	if(!(canvas instanceof HTMLElement)) canvas = document.querySelector(canvas);

	var c = { canvas: canvas }, gl;

	c.create = function(params) {
		gl = canvas.getContext("experimental-webgl", { antialias: true });
        c.setAsCurrent();
		return c;
	}

	c.size = function(w, h) {
		canvas.width = w;
		canvas.height = h;
		gl.viewport(0, 0, w, h);
		return c;
	}

	c.clearColor = function(r, g, b, a) {
		gl.clearColor(r, g, b, a);
		return c;
	}

	c.clear = function() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		return c;
	}

	c.setAsCurrent = function() {
		SQR.gl = gl;
		return c;
	}

	return c;
}