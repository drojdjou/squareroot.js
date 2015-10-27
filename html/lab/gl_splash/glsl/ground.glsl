//#name rampSkybox
//#vertex
attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform vec3 uEyePosition;

varying vec2 vUV;

void main(void) {
	vUV = aUV;
	gl_Position = uProjection *  uViewMatrix * vec4(aPosition, 1.0);	
}

//#fragment
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uTexture;

//#include fog

varying vec2 vUV;

uniform vec2 uTextureTile;

void main(void) {
	vec4 c = texture2D(uTexture, vUV * uTextureTile);

	float a = 1.0 - fogDepth();

	gl_FragColor = vec4(c.rgb, a * c.a);
}