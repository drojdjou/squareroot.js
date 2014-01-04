//#vertex
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMatrix;
uniform mat4 uProjection;

varying vec3 vNormal;
     
void main() {
	vNormal = aVertexNormal;
	gl_Position = uProjection * uMatrix * vec4(aVertexPosition, 1.0);
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