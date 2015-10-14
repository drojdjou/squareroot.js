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
varying float vLight;
     
void main() {

	vec4 p = uMatrix * vec4(aPosition, 1.0);
	vec4 lp =  vec4(uLightPosition, 1.0);
	float ld = 1.0 - smoothstep(0.0, uLightRange, length(lp - p));

	vLight = min(1.0, max(0.0, dot(p, lp))) * ld;

	vNormal = normalize(uNormalMatrix * aNormal);
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
precision mediump float;
               
uniform vec3 uColor;
uniform vec3 uDarkness;
uniform float uFogStart;
uniform float uFogEnd;
uniform vec3 uLightColor;
uniform float uLightIntensity;

varying vec3 vNormal;
varying float vLight;

//#include sphar-data
//#include sphar
           
void main() {

	float w = (gl_FragCoord.z / gl_FragCoord.w - uFogStart) / (uFogEnd - uFogStart);
	w = clamp(w, 0.0, 1.0);
	vec3 l = sphericalHarmonics(vNormal);
	vec3 c = uColor * l * l * l + uLightColor * vLight * uLightIntensity;

	gl_FragColor = vec4(mix(c, uDarkness, w), 1.0);
}