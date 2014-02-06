//#vertex
attribute vec3 aVertexPosition;

uniform mat4 uConcatMatrix;

varying vec3 vNormal;
     
void main() {
	gl_Position = uConcatMatrix * vec4(aVertexPosition, 1.0);
	gl_PointSize = 4.0;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
          
uniform vec4 uColor;
               
void main() {
	gl_FragColor = uColor;
}