//#vertex
precision mediump float;
attribute vec2 aPosition;
attribute vec2 aUV;

varying vec2 vUV;

void main(void) {
	gl_Position = vec4(aPosition, 0.0, 1.0);
	vUV = aUV;  
}

//#fragment
precision mediump float;
uniform sampler2D uTexture;
uniform sampler2D uBlurTexture;
varying vec2 vUV;

float brightness(vec3 c) {
	return c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722;
}

void main(void) {
	vec3 c = texture2D(uTexture, vUV).rgb;
	vec3 b = texture2D(uBlurTexture, vUV).rgb;

	// Bloom
	gl_FragColor = vec4(max(c, b * 1.33), 1.0);
	// Glow
	// if(c.r > 0.0) gl_FragColor = vec4(c + b, 1.0);
	// else gl_FragColor = vec4(b * 2.0, 1.0);
}