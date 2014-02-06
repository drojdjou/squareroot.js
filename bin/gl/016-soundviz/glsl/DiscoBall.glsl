//#vertex
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uConcatMatrix;
uniform mat3 uNormalMatrix;
uniform mat4 uMatrix;

uniform vec3 uEyePosition;


varying vec3 t;
varying vec3 tr;
varying vec3 tg;
varying vec3 tb;
varying float fac;

const vec3 chromaticDispertion = vec3(0.9, 1.0, 1.1);
// const vec3 chromaticDispertion = vec3(0, 0, 0);
const float bias = 0.9;
const float scale = 0.7;
const float power = 1.1;
     
void main() {
	vec3 vNormal = -normalize(uNormalMatrix * aVertexNormal);

	vec3 worldPosition = (uMatrix * vec4(aVertexPosition, 1.0)).xyz;
	vec3 incident = normalize(worldPosition - uEyePosition);

	t = reflect(incident, vNormal);	
	tr = refract(incident, vNormal, chromaticDispertion.x);
	tg = refract(incident, vNormal, chromaticDispertion.y);
	tb = refract(incident, vNormal, chromaticDispertion.z);

	fac = bias + scale * pow(1.0 + dot(incident, vNormal), power);

	gl_Position = uConcatMatrix * vec4(aVertexPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform samplerCube uCubemap;
uniform float uBeat;
uniform float uTime;
              
varying vec3 t;
varying vec3 tr;
varying vec3 tg;
varying vec3 tb;
varying float fac;

vec3 getcolor(vec3 p) {
	float m = (p.r + p.g + p.b) * 0.33 + uTime / -20.0;
	float c = 1.0 - step(uBeat, fract(m * 20.0));
	return vec3(c);
}

void main() {
	// vec4 ref = vec4(0, 0, 0, 1.0);
	vec4 ref = vec4(getcolor(t), 1.0);

	vec4 ret = vec4(0, 0, 0, 1.0);
	ret.r = getcolor(tr).r;
	ret.g = getcolor(tg).g;
	ret.b = getcolor(tb).b;

	vec3 c = (ret * fac + ref * (1.0 - fac)).rgb;
	// c *= 0.75;
	
	gl_FragColor = vec4(c, 1.0);
}



