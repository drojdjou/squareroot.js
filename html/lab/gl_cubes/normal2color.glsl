//#name normal2color.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying vec2 vUV;
	 
void main() {
	vNormal = uNormalMatrix * aNormal;
	// vNormal = aNormal;
	vUV = aUV;

	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
precision mediump float;

varying vec3 vNormal;
varying vec2 vUV;

void main() {
	gl_FragColor = vec4(0.5 + 0.5 * vNormal, 1.0);
	// gl_FragColor = vec4(vUV, 0.0, 1.0);
}