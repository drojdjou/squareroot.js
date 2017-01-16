//#name globe.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;
uniform vec3 uEyePosition;
uniform float uTime;

varying vec3 vNormal;
varying vec2 vUV;
varying vec3 vRefVec;
varying vec3 vIncident;

void main() {
	vNormal = uNormalMatrix * aNormal;
	// vNormal = aNormal;

	vec4 mPosition = uMatrix * vec4(aPosition, 1.0);
	vIncident = normalize(mPosition.xyz - uEyePosition);
	vRefVec = reflect(vIncident, vNormal);

	vUV = aUV;
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
precision mediump float;

#define PI 3.14159265359
#define PI2 6.28318530718
#define HEMISPEHERE_DIFFUSE

varying vec3 vNormal;
varying vec2 vUV;
varying vec3 vRefVec;
varying vec3 vIncident;

//#include standardLight

const vec3 cLight = vec3(1.0, -1.0, -0.6);
const vec4 cLightColor = vec4(1.0, 1.0, 1.0, 1.0);

uniform sampler2D uTexture;

void main() {
	// gl_FragColor = vec4(0.5 + 0.5 * vNormal, 1.0);
	// gl_FragColor = vec4(vUV, 0.0, 1.0);
	vec3 col = texture2D(uTexture, vUV).rgb;

	vec3 l = normalize(cLight);

	vec3 dif = diffuse(vNormal, l, cLightColor.rgb, cLightColor.a);
	vec3 spec = specular(vNormal, vIncident, l, cLightColor.rgb, 16.0, 0.4);
	

	vec3 r = -vRefVec;
	float u = 0.5 - atan(r.z, r.x) / PI2;
	float v = 0.5 - asin(r.y) / PI * 1.11;
	vec3 ref = texture2D(uTexture, vec2(u, v)).rgb;

	// gl_FragColor = vec4(, 1.0);
	gl_FragColor = vec4(col * (0.6 + dif) + spec, 1.0);
}










