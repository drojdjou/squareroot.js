// shader.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

uniform vec3 uEyePosition;

varying vec3 vNormal;
varying vec3 vRefVec;
varying vec3 vIncident;

void main()
{
	vNormal = uNormalMatrix * aNormal;

	vec4 mPosition = uMatrix * vec4(aPosition, 1.0);
	vIncident = normalize(mPosition.xyz - uEyePosition);
	vRefVec = reflect(vIncident, vNormal);

	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);

}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265359
#define PI2 6.28318530718
#define HEMISPEHERE_DIFFUSE
// #define SHADING

//#include standardLight

varying vec3 vNormal;
varying vec3 vRefVec;
varying vec3 vIncident;

const float cAmbient = 0.05;
const vec3 cLight = vec3(0.0, 0.0, 1.0);
const vec4 cLightColor = vec4(1.0, 0.9, 0.8, 0.4);

uniform sampler2D uTexture;
   
// http://en.wikipedia.org/wiki/UV_mapping#Finding_UV_on_a_sphere
void main() {

	#ifdef SHADING
	vec3 amb = cLightColor.rgb * cAmbient;
	vec3 dif = diffuse(vNormal, cLight, cLightColor.rgb, cLightColor.a);
	vec3 spec = specular(vNormal, vIncident, cLight, cLightColor.rgb, 8.0, 1.0);
	#else
	float dif = 0.25;
	#endif

	vec3 r = -vRefVec;
	float u = 0.5 - atan(r.z, r.x) / PI2;
	float v = 0.5 - asin(r.y) / PI;
	vec3 ref = texture2D(uTexture, vec2(u, v)).rgb * dif * 4.0;

	

	#ifdef SHADING
	gl_FragColor = vec4(amb + ref + dif + spec, 1.0);
	#else
	gl_FragColor = vec4(ref, 1.0);
	#endif
}


















