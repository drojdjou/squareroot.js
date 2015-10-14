// normal2color.glsl
//#vertex
attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

uniform vec3 uLightPosition;
uniform float uLightRange;

varying vec3 vNormal;
varying float vZ;
varying float vLight;
     
void main() {

	vec4 p = uMatrix * vec4(aPosition, 1.0);
	vec4 lp =  vec4(uLightPosition, 1.0);
	float ld = 1.0 - smoothstep(0.0, uLightRange, length(lp - p));

	vLight = min(1.0, max(0.0, dot(p, lp))) * ld;
	vNormal = normalize(uNormalMatrix * aNormal);

	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
	vZ = gl_Position.z;
}

//#fragment
precision mediump float;
               
uniform vec3 uColor;
uniform vec3 uDarkness;
uniform vec3 uLightColor;
uniform float uLightIntensity;

uniform float uFogStart;
uniform float uFogEnd;

varying vec3 vNormal;
varying float vZ;
varying float vLight;

//#include sphar-data
//#include sphar
           
void main() {
	float w = (vZ - uFogStart) / (uFogEnd - uFogStart);
	w = min(1.0, w);
	gl_FragColor = vec4(mix(uColor * sphericalHarmonics(vNormal) + uLightColor * vLight * uLightIntensity, uDarkness, w), 1.0);
}