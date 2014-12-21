/**
 *	When creating the Context object, a canvas element or a selector (ex. #gl-canvas) 
 *	can be passed to this function. If omitted a new canvas element will be created
 *	and it will be available as the .canvas property of the object 
 *	returned by the SQR.Context functio.
 */
SQR.Context = function(canvas) {

	var NOGL = "> SQR.Context - Webgl is not supported.";

	if(!canvas) canvas = document.createElement('canvas');
	if(!(canvas instanceof HTMLElement)) canvas = document.querySelector(canvas);

	var c = { canvas: canvas }, gl;

	/**
	 *	Creates the webgl context. 
	 *	Options as defined in Specs, section 5.2 
	 *	(https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.2)
	 *	Passing the options is not mandatory, if uses default values otherwise.
	 *
	 *	onError - specify a fallback funcion in case WebGL is not supported
	 *	if ommited, this function will throw a error if there are problems.
	 */
	c.create = function(options, onError) {

		onError = onError || function() { throw NOGL; };

		options = options || {};
		if(options.antialias === undefined) options.antialias = true;

		if(!window.WebGLRenderingContext) onError()

		try {
			gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
	    } catch(e) { 
	    	console.error(e);
	    	onError();
	    } 

		c.gl = gl;
        c.setAsCurrent();
		return c;
	}

	/** 
	 *	Sets the canvas and the viewport size to the given values.
	 */
	c.size = function(w, h) {
		canvas.width = w;
		canvas.height = h;
		gl.viewport(0, 0, w, h);
		return c;
	}

	/**
	 *	Define clear color. 
	 *	r, g, b, a are in [0-1] range.
	 */
	c.clearColor = function(r, g, b, a) {
		gl.clearColor(r, g, b, a);
		return c;
	}

	/**
	 *	Quick viewport clear function - clears both color and depth buffers.
	 *	Typically called at each frame before rendering to screen.
	 *	For custom clearing options use SQR.gl.clear()
	 */
	c.clear = function() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		return c;
	}

	/**
	 *	Sets this context as current in the global SQR.gl variable.
	 *	This variable is used by the engine to perform rendering.
	 */
	c.setAsCurrent = function() {
		SQR.gl = gl;
		return c;
	}

	return c;
}