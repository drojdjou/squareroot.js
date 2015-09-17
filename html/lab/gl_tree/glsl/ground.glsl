// normal2color.glsl
//#vertex
attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
     
void main() {
	vNormal = normalize(uNormalMatrix * aNormal);
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
precision highp float;
               
uniform vec3 uColor;
uniform vec3 uDarkness;
uniform float uFogStart;
uniform float uFogEnd;

varying vec3 vNormal;

//#include sphar-data
//#include sphar
           
void main() {

	float w = (gl_FragCoord.z / gl_FragCoord.w - uFogStart) / (uFogEnd - uFogStart);
	w = clamp(w, 0.0, 1.0);
	vec3 l = sphericalHarmonics(vNormal);
	vec3 c = uColor * l * l * l;

	gl_FragColor = vec4(mix(c, uDarkness, w), 1.0);
}