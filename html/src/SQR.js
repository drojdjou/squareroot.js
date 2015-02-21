/**
 *	@namespace SQR
 *	@description The global engine namesapce. All classes belong to this namespace.
 */
var SQR = {

	/**
	 *	@property TWOPI - shorthand for `Math.PI * 2`
	 */
	TWOPI: Math.PI * 2,

	/**
	 *	@property TWOPI - shorthand for `Math.PI * 0.5`
	 */
	HALFPI: Math.PI * 0.5,

	/**
	 *	@property EPSILON - a very small number, used to prevent rounding errors
	 */
	EPSILON: 1.0e-6,

	/**
	 *	@property gl - Placeholder that holds current gl context. This is set in SQR.Context.create(), but can be modified manually too
	 */
	gl: null, 
	
	/** 
	 *	@property fullScreenQuad - placeholder that holds a fullscreen geometry for post effects. Lazily created in PostEffect.js
	 *	Typically not set manually.
	 */
	fullScreenQuad: null,

	/**
	 *	@property shaderPath - a path relative to the main HTML file where the src/glsl folder is located.
	 *	Only necessary to if builtin shader code is loaded (using ~ paths).
	 *
	 *	@default .
	 */
	shaderPath: '.',

	/**
	 *	@namespace Primitives
	 *	@memberof SQR
	 *	@description A collection of classes & functions and utilities to create geometries
	 */
	Primitives: {},

	/**
	 *	@method v2
	 *	@memberof SQR
	 *
	 *	Shorthand for { aPosition: 2 }
	 */
	v2: function() { return { aPosition: 2 }; },

	/**
	 *	@method v2
	 *	@memberof SQR
	 *
	 *	Shorthand for { aPosition: 2 }
	 */
	v3: function() { return { aPosition: 3 }; },

	/**
	 *	@method v2
	 *	@memberof SQR
	 *
	 *	Shorthand for { aPosition: 2, aUV: 2 }
	 */
	v2u2: function() { return { aPosition: 2, aUV: 2 }; },

	/**
	 *	@method v2
	 *	@memberof SQR
	 *
	 *	Shorthand for { aPosition: 2, aColor: 3 }
	 */
	v2c3: function() { return { aPosition: 2, aColor: 3 }; },

	/**
	 *	@method v2
	 *	@memberof SQR
	 *
	 *	Shorthand for { aPosition: 3, aNormal: 3 }
	 */
	v3n3: function() { return { aPosition: 3, aNormal: 3 }; },

	/**
	 *	@method v2
	 *	@memberof SQR
	 *
	 *	Shorthand for { aPosition: 3, aNormal: 3, aUV: 2 }
	 */
	v3n3u2: function() { return { aPosition: 3, aNormal: 3, aUV: 2 }; },

    // Error reporting 

    // Issues a console.warn() is user attempts to set a uniform that does not exist on the shader
    WARN_UNIFORM_NOT_PRESENT : false 

};