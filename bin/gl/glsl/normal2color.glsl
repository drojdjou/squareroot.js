//#vertex
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uConcatMatrix;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
     
void main() {
	vNormal = aVertexNormal;
	gl_Position = uConcatMatrix * vec4(aVertexPosition, 1.0);
	gl_PointSize = 3.0;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform vec4 uColor;
               
varying vec3 vNormal;
               
void main() {
	vec3 c = vec3(0.5) + vNormal * 0.5;
	gl_FragColor = uColor * 0.5 + vec4(c, 1.0);
}