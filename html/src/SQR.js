SQR = {

	// Global vars
	TWOPI: Math.PI * 2,
	HALFPI: Math.PI * 0.5,
	EPSILON: 1.0e-6,

	// Placeholder that holds current gl context. This is set in Context.create(), can be modified manually too
	gl: null, 
	// Placeholder that holdes a fullscreen geometry for post effects. Lazily created in PostEffect.js
	fullScreenQuad: null,
	//
	shaderPath: '.',

	// Namespaces
	Primitives: {},

	// Typical mesh layouts
	// Commonly used attribute names are: aPosition, aColor, aNormal, aUV, aUV2...
	v2: function() { return { aPosition: 2 }; },
	v3: function() { return { aPosition: 3 }; },
	v2u2: function() { return { aPosition: 2, aUV: 2 }; },
	v2c3: function() { return { aPosition: 2, aColor: 3 }; },
	v3n3: function() { return { aPosition: 3, aNormal: 3 }; },
	v3n3u2: function() { return { aPosition: 3, aNormal: 3, aUV: 2 }; },

	// GL contstants (removed, because this stuff can be accessed via SQR.gl)
	// POINTS          : 0x0000,
	// LINES           : 0x0001,
	// LINE_LOOP       : 0x0002,
	// LINE_STRIP      : 0x0003,
	// TRIANGLES       : 0x0004,
	// TRIANGLE_STRIP  : 0x0005,
	// TRIANGLE_FAN	   : 0x0006,

    // Error reporting 

    // Issues a console.warn() is user attempts to set a uniform that does not exist on the shader
    WARN_UNIFORM_NOT_PRESENT : false 

};