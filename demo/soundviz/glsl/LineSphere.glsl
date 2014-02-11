//#vertex
attribute vec3 aVertexPosition;

uniform mat4 uConcatMatrix;
uniform mat4 uMatrix;
uniform mat3 uNormalMatrix;

uniform float uTime;

varying vec3 vNormal;
varying vec3 vLocalNormal;
varying float vDif;
     
void main() {
	vLocalNormal = normalize(aVertexPosition);
	vNormal = uNormalMatrix * vLocalNormal;

	vec3 uLight = vec3(sin(uTime * 0.33), cos(uTime * 0.33), 0);
	vDif = smoothstep(0.4, 1.0, max(0.0, dot(vNormal, uLight)));

	vec3 p = aVertexPosition;

	gl_Position = uConcatMatrix * vec4(p, 1.0);
	gl_PointSize = 2.0;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform float uColorMult;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vLocalNormal;
varying float vDif;
                  
void main() {
	vec3 lc = 0.2 + vLocalNormal * 0.8;
	vec3 c = mix(lc, vec3(1.0), vDif);

	float a = dot(vNormal, vec3(0.0, 0.0, 1.0)) * 0.5 + 0.5;
	a = 0.1 + 0.9 * a;

	gl_FragColor = vec4(c, a);
}