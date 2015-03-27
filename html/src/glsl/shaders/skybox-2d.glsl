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
	gl_Position = uProjection * uViewMatrix * vec4(uEyePosition + aPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uTexture;

varying vec2 vUV;

void main(void) {
	gl_FragColor = texture2D(uTexture, vUV);
	// gl_FragColor = vec4(vUV.x, vUV.y, 0.0, 1.0);
}