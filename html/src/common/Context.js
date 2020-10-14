/**
 *	@class Context
 *	@memberof SQR
 *	
 *	@description When creating the Context object, a canvas element or a selector (ex. #gl-canvas) 
 *	can be passed to this function. If omitted a new canvas element will be created
 *	and it will be available as the canvas property of the object 
 *	returned by the SQR.Context functiom. See quick example below or read more in {@tutorial basic-setup}.
 *
 *	@example
// the `new` keyword is optional, all methods are chainable
var w = window.innerWidth, h = window.innerHeight;
var c = SQR.Context('#canvas').create().size(w, h).clearColor(0, 0, 0, 1);
 */
SQR.Context = function(canvas, options, onError) {

	if(!SQR._versionDisplayed && SQR.Version) {
		console.log('%cSquareroot v' + SQR.Version.version + ' b' + SQR.Version.build, 'background: #663399; color: #dd99ff; padding: 4px 10px 4px 10px');
		SQR._versionDisplayed = true;
	}
 
	var NOGL = "> SQR.Context - Webgl is not supported.";
	var BADCTX = "> SQR.Context - Invalid canvas reference.";

	if(!canvas) canvas = document.createElement('canvas');
	if(!(canvas instanceof HTMLElement)) canvas = document.querySelector(canvas);
	if(!canvas.getContext) throw BADCTX;

	var c = { 

		/**
		 *	@var {HTMLCanvasElement} canvas - Represents the canvas used to get the webgl context from.
		 *	@memberof SQR.Context.prototype
		 */
		canvas: canvas 
	}, gl;

	/**
	 *	@method create
	 *	@memberof SQR.Context.prototype
	 *	
	 *	@description Creates the webgl context. 
	 *	
	 *	@param options Options as defined in Specs, section 5.2.
	 *	Passing the options is not mandatory, if uses default values otherwise.
	 *	@link https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.2
	 *	
	 *	@param onError callback in case WebGL is not supported
	 *	if ommited, this function will throw (see below) a error if there are problems.
	 *
	 *	@throws error is webgl context cannot be created (ex. webgl is not supported)
	 *
	 *	@returns SQR.Context
	 */
	c.create = function(options, onError) {

		onError = onError || function() { throw NOGL; };

		options = options || {};
		if(options.antialias === undefined) options.antialias = true;
		if(options.stencil === undefined) options.stencil = false;

		if(!window.WebGLRenderingContext) onError();

		try {
			gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
		} catch(e) { 
			console.error(e);
			onError();
		} 

		if(!gl) {
			onError();
		}

		c.gl = gl;
		c.setAsCurrent();

		gl.enable(gl.CULL_FACE);
		if(options.customGLSetup) options.customGLSetup();

		return c;
	}

	/** 
	 *	Sets the canvas and the viewport size to the given values.
	 */
	c.size = function(w, h, res) {
		res = res || 1;
		
		canvas.width = w * res;
		canvas.height = h * res;

		c.viewport(0, 0, w * res, h * res);

		// canvas.style.width =  w + 'px';
		// canvas.style.height = h + 'px';
		// var s = 1 / res;
		// canvas.ext.transform({ scaleX: s, scaleY: s });

		return c;
	}

	c.viewport = function(x, y, w, h) {
		gl.viewport(x, y, w, h);
		return c;
	}

	c.clearColor = function(r, g, b, a) {
		// console.log('context.clearColor is deprecated, use renderer clear color instead');
		// console.trace();
		gl.clearColor(r, g, b, a);
		gl.clear(gl.COLOR_BUFFER_BIT);
		return c;
	}

	/**
	 *	Quick viewport clear function - clears both color and depth buffers.
	 *	Typically called at each frame before rendering to screen.
	 *	For custom clearing options use SQR.gl.clear()
	 */
	c.clear = function() {
		if(gl) gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
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

	c.destroy = function() {
		gl = null;
		canvas = null;
	}

	// Create the context
	c.create(options, onError);

	return c;
}