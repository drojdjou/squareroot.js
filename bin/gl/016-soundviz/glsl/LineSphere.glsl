//#vertex
attribute vec3 aVertexPosition;

uniform mat4 uConcatMatrix;
uniform mat4 uMatrix;

uniform float uTime;

varying vec3 vNormal;
varying vec3 vLocalNormal;
varying float vDif;
     
void main() {
	vNormal = normalize(uMatrix * vec4(aVertexPosition, 1.0)).rgb;
	vLocalNormal = abs(normalize(aVertexPosition));

	vec3 uLight = vec3(sin(uTime), cos(uTime), 0.5);
	vDif = pow(abs(dot(vNormal, uLight)), 9.0);

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
	
	vec3 c = mix(vec3(1.0), vLocalNormal * 0.8, 1.0 - vDif);

	gl_FragColor = vec4(c, dot(vNormal, vec3(0, 0, 1.0)));
}