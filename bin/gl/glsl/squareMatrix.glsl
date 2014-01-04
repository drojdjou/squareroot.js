// 001-square-matrix.glsl
//#vertex
attribute vec2 aVertexPosition;

uniform mat4 uConcatMatrix;
     
void main() {
	gl_Position = uConcatMatrix * vec4(aVertexPosition, 0.0, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
               
uniform vec4 uColor;
               
void main() {
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // uColor;
}