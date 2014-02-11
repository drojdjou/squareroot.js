//#vertex
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uConcatMatrix;
uniform mat3 uNormalMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uMatrix;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vFog;
     
void main() {
	vNormal = aVertexNormal;
	vPosition = aVertexPosition;

	vec3 p = (uViewMatrix * uMatrix * vec4(aVertexPosition, 1.0)).xyz;
	
	float near = 200.0;
	float far = 400.0;
	float d = length(p);
	vFog = clamp(d, 0.0, 1.0);

	gl_Position = uConcatMatrix * vec4(aVertexPosition, 1.0);
	gl_PointSize = 3.0;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform vec3 uColor;

uniform float uHeight;
               
varying vec3 vNormal;
varying vec3 vPosition;
varying float vFog;

const vec3 light = vec3(-0.5, 0, 1);
               
void main() {
	vec3 c = uColor.rgb;

	float dif = 0.6 + 0.4 * max(0.0, dot(vNormal, normalize(light)));
	float shadow = 0.6 + 0.4 * clamp(vPosition.y / uHeight, 0.0, 1.0);

	gl_FragColor = vec4(c * dif * shadow, 1.0);
}