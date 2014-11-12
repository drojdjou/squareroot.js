attribute vec3 aPosition;

uniform mat4 uMatrix;
uniform mat4 uProjection;

varying vec4 vPosition;
     
void main() {
	vPosition = uProjection * uMatrix * vec4(aPosition, 1.0);
	gl_Position = vPosition;
}

//#fragment
#ifdef GL_ES
precision mediump float;
#endif

uniform float uFar;
uniform float uNear;

varying vec4 vPosition;

void main() {
	float w = 1.0 - (gl_FragCoord.z / gl_FragCoord.w - uNear) / (uFar - uNear);
	gl_FragColor = vec4(w, w, w, 1.0);
}