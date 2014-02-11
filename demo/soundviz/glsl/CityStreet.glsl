//#vertex
attribute vec3 aVertexPosition;

uniform mat4 uConcatMatrix;

void main() {
	gl_Position = uConcatMatrix * vec4(aVertexPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

void main() {
	gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}