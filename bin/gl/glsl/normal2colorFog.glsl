//#vertex
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uConcatMatrix;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying float vFog;
     
void main() {
	vNormal = uNormalMatrix * aVertexNormal;
	vec3 p = (uViewMatrix * uMatrix * vec4(aVertexPosition, 1.0)).xyz;
	float d = 1.0 - length(p) / 300.0;
	vFog = clamp(d, 0.0, 1.0);
	gl_Position = uConcatMatrix * vec4(aVertexPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform vec4 uColor;
               
varying vec3 vNormal;
varying float vFog;
               
void main() {
	vec3 c = vec3(0.5) + vNormal * 0.5;
	c = (uColor.rgb * 0.5 * c + c) * vFog;
	gl_FragColor = vec4(c, 1.0);
}