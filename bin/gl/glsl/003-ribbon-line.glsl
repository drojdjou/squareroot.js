// 003-ribbon-line.glsl
//#vertex
attribute vec3 aPosition;

uniform mat4 uConcatMatrix;
     
void main() {
	gl_Position = uConcatMatrix * vec4(aPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform vec4 uColor;
               
void main() {
	gl_FragColor = uColor;
}