//#vertex
attribute vec3 aPosition;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform vec3 uEyePosition;

varying vec3 vPosition;

void main(void) {
	gl_Position = uProjection * uViewMatrix * vec4(uEyePosition + aPosition, 1.0);
	vPosition = aPosition;	
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform samplerCube uCubemap;

varying vec3 vPosition;

void main(void) {
	gl_FragColor = textureCube(uCubemap, vPosition);
	// gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}