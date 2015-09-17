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
uniform vec3 uFogColor;

varying vec3 vNormal;

//#include sphar-data
//#include sphar
           
void main() {

	float w = (gl_FragCoord.z / gl_FragCoord.w - uFogStart) / (uFogEnd - uFogStart);

	// float fs = smoothstep(0.8, 1.0, w);
	// float ls = smoothstep(0.0, 0.8, w);
	// vec3 l = sphericalHarmonics(vNormal);

	// vec3 c = mix(uColor * l, uFogColor * l, ls);
	// vec3 d = mix(uFogColor * l, uDarkness, fs);

	// gl_FragColor = vec4(mix(c, d, fs), 1.0);

	gl_FragColor = vec4(mix(uColor * sphericalHarmonics(vNormal), uDarkness, w), 1.0);
}