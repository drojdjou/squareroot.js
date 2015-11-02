//#name Reflective
//#description Based on Cg tutorial: http://http.developer.nvidia.com/CgTutorial/cg_tutorial_chapter07.html
//#author bartekd

// shader.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;

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
varying vec3 t;
varying vec3 tr;
varying vec3 tg;
varying vec3 tb;
varying float rfac;
     
void main() {

	vec4 mPosition = uMatrix * vec4(aPosition, 1.0);
	vec3 normal = uNormalMatrix * aNormal;
	vec3 incident = normalize(mPosition.xyz - uEyePosition);

	t = reflect(incident, normal);	
	tr = refract(incident, normal, chromaticDispertion.x);
	tg = refract(incident, normal, chromaticDispertion.y);
	tb = refract(incident, normal, chromaticDispertion.z);
	
	// bias, scale, 1, power
	rfac = bias + scale * pow(1.0 + dot(incident, normal), power);

	vec4 mvPosition = uViewMatrix * vec4(aPosition, 1.0);
	gl_Position = uProjection * mvPosition;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform samplerCube uCubemap;
uniform vec3 uColor;

varying vec3 vNormal;
varying vec3 t;
varying vec3 tr;
varying vec3 tg;
varying vec3 tb;
varying float rfac;

void main(void) {
	vec3 ref = textureCube(uCubemap, t).rgb;

	vec3 ret = vec3(1.0);
	ret.r = textureCube(uCubemap, tr).r;
	ret.g = textureCube(uCubemap, tg).g;
	ret.b = textureCube(uCubemap, tb).b;
	
	vec3 c = ret * (1.0 - rfac) + ref * rfac + uColor;

	gl_FragColor = vec4(c, 1.0);
}











