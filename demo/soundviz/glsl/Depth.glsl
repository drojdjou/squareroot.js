//#vertex
//#vertex
attribute vec3 aVertexPosition;

uniform mat4 uConcatMatrix;
uniform mat3 uNormalMatrix;

varying vec4 vPosition;
     
void main() {
	vPosition = uConcatMatrix * vec4(aVertexPosition, 1.0);
	gl_Position = vPosition;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform float far;
uniform float near;

varying vec4 vPosition;

void main() {
	float w = 1.0 - (gl_FragCoord.z / gl_FragCoord.w - near) / (far - near);
	gl_FragColor = vec4(w, w, w, 1.0);
}