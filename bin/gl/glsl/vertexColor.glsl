//#vertex
attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uConcatMatrix;

varying vec3 vColor;
     
void main() {
	vColor = aVertexColor;
	gl_Position = uConcatMatrix * vec4(aVertexPosition, 1.0);
	gl_PointSize = 3.0;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
     
varying vec3 vColor;
               
void main() {
	gl_FragColor = vec4(vColor, 1.0);
}