//#name Reflective
//#description Based on Cg tutorial: http://http.developer.nvidia.com/CgTutorial/cg_tutorial_chapter07.html
//#author bartekd

// shader.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

uniform vec3 uEyePosition;

uniform vec3 chromaticDispertion;
uniform float bias;
uniform float scale;
uniform float power;

varying vec3 vNormal;
varying vec3 vIncident;
varying vec3 t;
varying vec3 tr;
varying vec3 tg;
varying vec3 tb;
varying float rfac;
     
void main() {

	vec4 mPosition = uMatrix * vec4(aPosition, 1.0);

	vNormal = uNormalMatrix * aNormal;
	vIncident = normalize(mPosition.xyz - uEyePosition);

	t = reflect(vIncident, vNormal);	
	tr = refract(vIncident, vNormal, chromaticDispertion.x);
	tg = refract(vIncident, vNormal, chromaticDispertion.y);
	tb = refract(vIncident, vNormal, chromaticDispertion.z);
	
	rfac = bias + scale * pow(1.0 + dot(vIncident, vNormal), power);

	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform samplerCube uCubemap;

uniform vec3 uColor;
uniform vec3 uLight;
uniform float uAmbient;
uniform float uShininess;
uniform float uSpecularIntensity;

varying vec3 vNormal;
varying vec3 vIncident;
varying vec3 t;
varying vec3 tr;
varying vec3 tg;
varying vec3 tb;
varying float rfac;

//#include slm

void main(void) {

	vec3 amb = uColor * uAmbient;
	vec3 dif = hemisphere(vNormal, uLight, uColor);
	vec3 spc = specular(vNormal, vIncident, uLight, uColor, uShininess, uSpecularIntensity);

	vec3 ref = textureCube(uCubemap, t).rgb;
	vec3 ret = vec3(1.0);
	ret.r = textureCube(uCubemap, tr).r;
	ret.g = textureCube(uCubemap, tg).g;
	ret.b = textureCube(uCubemap, tb).b;
	vec3 gls = ret * (1.0 - rfac) + ref * rfac;

	// vec3 grs = vec3(brightness(gls));
	// gls = mix(gls, grs, 0.8);

	gl_FragColor = vec4(amb + dif + spc + gls, 1.0);
}











